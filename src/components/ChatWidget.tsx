import { AnimatePresence, motion } from 'framer-motion';
import { Fragment, useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { profile } from '../data/profile';
import { ChatIcon, CloseIcon, SendIcon } from './Icons';

// Chat proxy (worker/). The OpenRouter key lives there, never in the browser.
const API_URL: string =
  import.meta.env.VITE_CHAT_API_URL || (import.meta.env.DEV ? 'http://localhost:8787' : '');

const STORAGE_KEY = 'talk-with-me:v1';
const IDLE_TIMEOUT_MS = 30_000;
const OPEN_EVENT = 'open-chat';

/** Lets any component open the chat, e.g. a "Talk with me" button. */
export const openChat = () => window.dispatchEvent(new Event(OPEN_EVENT));
/** False when no chat proxy is configured (the widget then renders nothing). */
export const chatEnabled = Boolean(API_URL);

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const firstName = profile.name.split(' ')[0];
const GREETING: Message = {
  role: 'assistant',
  content: `Hi! I'm ${firstName}'s assistant. Ask me anything about his experience, skills or projects — in English or French.`,
};
const SUGGESTIONS = [
  'What is he working on now?',
  'Tell me about his LLM inference work',
  'Why hire him for an AI platform?',
  'Quelles sont ses compétences ?',
];

function loadHistory(): Message[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Message[]) : null;
    return Array.isArray(parsed) && parsed.length ? parsed : [GREETING];
  } catch {
    return [GREETING];
  }
}

/** Minimal, safe formatting: paragraphs, "- " bullets and **bold**. No HTML injection. */
function renderText(text: string): ReactNode {
  const inline = (s: string) =>
    s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>,
    );
  const blocks = text.trim().split(/\n{2,}/);
  return blocks.map((block, i) => {
    const lines = block.split('\n');
    if (lines.every((l) => /^\s*([-*•]|\d+\.)\s+/.test(l))) {
      return (
        <ul key={i}>
          {lines.map((l, j) => (
            <li key={j}>{inline(l.replace(/^\s*([-*•]|\d+\.)\s+/, ''))}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i}>
        {lines.map((l, j) => (
          <Fragment key={j}>
            {j > 0 && <br />}
            {inline(l)}
          </Fragment>
        ))}
      </p>
    );
  });
}

async function streamReply(history: Message[], onToken: (t: string) => void, signal: AbortSignal) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history.filter((m) => m !== GREETING && m.content !== GREETING.content) }),
    signal,
  });
  if (!res.ok || !res.body) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? 'The assistant is unavailable right now.');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') return;
      try {
        const chunk = JSON.parse(data);
        if (chunk.error) throw new Error('The assistant hit an error. Please try again.');
        const token: string | undefined = chunk.choices?.[0]?.delta?.content;
        if (token) onToken(token);
      } catch (e) {
        if (e instanceof Error && e.message.startsWith('The assistant')) throw e;
      }
    }
  }
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadHistory);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* storage unavailable: history just won't survive a reload */
    }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || busy) return;
      const history: Message[] = [...messages, { role: 'user', content }];
      setMessages([...history, { role: 'assistant', content: '' }]);
      setInput('');
      setError(null);
      setBusy(true);
      const controller = new AbortController();
      abortRef.current = controller;
      // Free upstream models occasionally stall: give up if the stream goes quiet.
      let timedOut = false;
      let idle: ReturnType<typeof setTimeout> | undefined;
      const armIdleTimer = () => {
        clearTimeout(idle);
        idle = setTimeout(() => {
          timedOut = true;
          controller.abort();
        }, IDLE_TIMEOUT_MS);
      };
      armIdleTimer();
      try {
        await streamReply(
          history,
          (token) => {
            armIdleTimer();
            setMessages((prev) => {
              const next = prev.slice();
              const last = next[next.length - 1];
              next[next.length - 1] = { ...last, content: last.content + token };
              return next;
            });
          },
          controller.signal,
        );
      } catch (e) {
        if (timedOut) setError('The assistant is taking too long — please try again.');
        else if (!controller.signal.aborted) setError(e instanceof Error ? e.message : 'Something went wrong.');
      } finally {
        clearTimeout(idle);
        // Drop an empty assistant bubble if nothing came back.
        setMessages((prev) => (prev[prev.length - 1]?.content ? prev : prev.slice(0, -1)));
        setBusy(false);
      }
    },
    [busy, messages],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([GREETING]);
    setError(null);
  };

  if (!API_URL) return null;

  const last = messages[messages.length - 1];
  const waiting = busy && last?.role === 'assistant' && !last.content;
  const showSuggestions = messages.length === 1 && !busy;

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            type="button"
            className="chat-launcher"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            aria-haspopup="dialog"
          >
            <ChatIcon width={20} height={20} />
            <span>Talk with me</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            className="chat-panel"
            role="dialog"
            aria-modal="false"
            aria-labelledby="chat-title"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            <header className="chat-header">
              <img className="chat-avatar" src={profile.portrait} alt="" width={36} height={36} />
              <div className="chat-heading">
                <h2 id="chat-title">Talk with {firstName}</h2>
                <p>AI assistant · answers from his profile</p>
              </div>
              {messages.length > 1 && (
                <button type="button" className="chat-text-btn" onClick={reset}>
                  New chat
                </button>
              )}
              <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">
                <CloseIcon />
              </button>
            </header>

            <div className="chat-messages" ref={listRef} aria-live="polite">
              {messages.map((m, i) =>
                m.content ? (
                  <motion.div
                    key={i}
                    className={`chat-msg chat-msg-${m.role}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {m.role === 'assistant' ? renderText(m.content) : m.content}
                  </motion.div>
                ) : null,
              )}
              {waiting && (
                <div className="chat-msg chat-msg-assistant chat-typing" aria-label="Assistant is typing">
                  <span />
                  <span />
                  <span />
                </div>
              )}
              {error && (
                <div className="chat-error" role="alert">
                  {error}{' '}
                  <a href={`mailto:${profile.contact.email}`}>Email {firstName} instead</a>
                </div>
              )}
              {showSuggestions && (
                <div className="chat-suggestions">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} type="button" onClick={() => void send(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form className="chat-form" onSubmit={onSubmit}>
              <label htmlFor="chat-input" className="visually-hidden">
                Your question
              </label>
              <textarea
                id="chat-input"
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={1500}
                placeholder={`Ask about ${firstName}…`}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
              />
              <button type="submit" className="chat-send" disabled={busy || !input.trim()} aria-label="Send">
                <SendIcon />
              </button>
            </form>
            <p className="chat-disclaimer">AI-generated answers can be wrong — check the CV for details.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
