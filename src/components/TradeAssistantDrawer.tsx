import React, { useState } from 'react';
import { ChevronUp, ChevronDown, X, ArrowUp } from 'lucide-react';

interface TradeAssistantDrawerProps {
  onNavigateTab: (tab: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

export const TradeAssistantDrawer: React.FC<TradeAssistantDrawerProps> = ({ onNavigateTab }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: "Hi! I've checked your trade order #0842. Your invoice, purchase order, and cargo ship receipt match 100%. You can withdraw $116,156.00 today. How can I help you?",
    },
  ]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-3 sm:bottom-5 sm:right-6 z-40 bg-neutral-950 text-white p-3 rounded-full shadow-2xl flex items-center space-x-2 text-xs font-medium hover:bg-neutral-800 transition-all cursor-pointer"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Trade Assistant</span>
      </button>
    );
  }

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
    };

    let reply = '';
    const qLower = query.toLowerCase();

    if (qLower.includes('payout') || qLower.includes('simple words') || qLower.includes('explain')) {
      reply =
        'Here is your payout breakdown: Total cargo invoice is $142,000.00. You selected an 85% advance rate ($120,700.00). CashFlow charges a flat 3.2% fee ($4,544.00) with $0 hidden bank wire fees. You receive $116,156.00 deposited directly into your bank today! When the Maersk ship docks in Hamburg, you receive the remaining $21,300.00 reserve.';
    } else if (qLower.includes('approved') || qLower.includes('why') || qLower.includes('verified')) {
      reply =
        'Your invoice passed via automated 3-way triangulation: 1) Price of $3,550/MT matched the buyer Purchase Order exactly. 2) Shipping date March 28 was within the agreed delivery window. 3) Maersk confirmed container MRSK-9821491 was loaded aboard vessel MAERSK MC-KINNEY MOLLER.';
    } else if (qLower.includes('buyer') || qLower.includes('safe') || qLower.includes('risk')) {
      reply =
        'Yes, Global Harvest Corp is fully verified. They have completed 18 previous escrow trades on CashFlow with a 100% on-time release record. Furthermore, their $142,000.00 deposit is already safely locked in our cryptographic escrow vault.';
    } else if (qLower.includes('release') || qLower.includes('code')) {
      reply =
        'Shipment release code CF-REL-9821-X4 is ready! The buyer will enter this at the Hamburg port terminal to release the cargo once final customs inspection is completed.';
    } else if (qLower.includes('role') || qLower.includes('auth')) {
      reply =
        'To manage your institutional credentials or switch roles between Exporter, Importer, and Financier, open the "Auth & RBAC" screen in the top navigation bar.';
    } else {
      reply = `I analyzed "${query}" against your active trade contract rules. Everything is in order with 0% discrepancies and full escrow backing on Base Sepolia.`;
    }

    const botMsg: ChatMessage = {
      id: `b-${Date.now()}`,
      sender: 'bot',
      text: reply,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputVal('');
  };

  return (
    <div
      className="fixed bottom-4 right-3 sm:bottom-5 sm:right-6 w-96 max-w-[calc(100vw-1.5rem)] bg-white border border-neutral-300 rounded-xl shadow-2xl z-40 overflow-hidden flex flex-col transition-all duration-300"
      id="copilot-drawer"
    >
      {/* Header */}
      <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <h4 className="text-xs font-semibold text-neutral-950">CashFlow Trade Assistant</h4>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-neutral-400 hover:text-neutral-950 p-1 focus:outline-none rounded cursor-pointer"
            aria-label={isMinimized ? 'Expand assistant' : 'Minimize assistant'}
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-neutral-400 hover:text-neutral-950 p-1 focus:outline-none rounded cursor-pointer"
            aria-label="Close assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
        <div className="p-4 space-y-3 flex flex-col justify-between max-h-96">
          {/* Chat History */}
          <div className="overflow-y-auto space-y-2 pr-1 max-h-52 custom-scrollbar text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-lg leading-relaxed ${
                  m.sender === 'bot'
                    ? 'bg-neutral-50 border border-neutral-200 text-neutral-800'
                    : 'bg-neutral-950 text-white ml-6 text-right'
                }`}
              >
                {m.sender === 'bot' && (
                  <span className="text-emerald-800 font-semibold block mb-1 text-xs font-mono">
                    Trade Assistant:
                  </span>
                )}
                {m.text}
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          <div className="space-y-1.5 pt-1 border-t border-neutral-200">
            <div className="text-xs text-neutral-500 font-medium">Quick Questions:</div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleSend('Explain my payout in simple words')}
                className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-all cursor-pointer"
              >
                Explain payout in simple words
              </button>
              <button
                onClick={() => handleSend('Why was my invoice approved?')}
                className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-all cursor-pointer"
              >
                Why was invoice approved?
              </button>
              <button
                onClick={() => handleSend('Is my buyer verified & safe?')}
                className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-all cursor-pointer"
              >
                Is buyer verified?
              </button>
            </div>
          </div>

          {/* Input Box */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask any question in plain English..."
              className="bg-neutral-50 border border-neutral-300 rounded-full px-3.5 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 w-full focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
            <button
              onClick={() => handleSend()}
              className="bg-neutral-950 text-white p-2 rounded-full hover:bg-neutral-800 focus:outline-none flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
