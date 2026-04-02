import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

function ChatComponent({ itemId, senderName, receiverName, itemName, onClose }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messageList]);

    useEffect(() => {
        // Join the chat room for this item
        socket.emit("join_room", itemId);

        // Fetch existing messages
        const fetchMessages = async () => {
            const res = await fetch(`http://localhost:5000/api/messages/${itemId}`);
            const data = await res.json();
            setMessageList(data);
        };
        fetchMessages();

        // Real-time message listener
        const eventListener = (data) => {
            setMessageList((list) => [...list, data]);
        };
        socket.on("receive_message", eventListener);

        return () => {
            socket.off("receive_message", eventListener);
        };
    }, [itemId]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                itemId: itemId,
                senderName: senderName,
                receiverName: receiverName,
                text: currentMessage,
            };

            await socket.emit("send_message", messageData);
            setCurrentMessage("");
        }
    };

    return (
        <div className="fixed bottom-6 right-6 w-[400px] h-[550px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-[1000] border-4 border-white">
            {/* Header */}
            <div className="p-6 bg-[#023E8A] text-white flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black text-xl backdrop-blur-md">
                        {itemName?.charAt(0) || 'C'}
                    </div>
                    <div>
                        <h3 className="font-black text-sm uppercase tracking-widest">{itemName}</h3>
                        <p className="text-[10px] font-bold text-blue-200 uppercase tracking-tighter">Chatting with {receiverName}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all font-black"
                >
                    ✕
                </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 scrollbar-hide">
                {messageList.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex flex-col ${msg.senderName === senderName ? 'items-end' : 'items-start'}`}
                    >
                        <div
                            className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm font-medium leading-relaxed ${msg.senderName === senderName
                                ? 'bg-[#4C6EF5] text-white rounded-tr-none'
                                : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                                }`}
                        >
                            {msg.text}
                        </div>
                        <span className="text-[9px] font-black text-gray-400 mt-1 uppercase tracking-tighter px-1">
                            {msg.senderName} • {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-5 bg-white border-t border-gray-50 flex items-center gap-3">
                <input
                    type="text"
                    value={currentMessage}
                    placeholder="Type your message..."
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-medium focus:ring-2 focus:ring-[#4C6EF5] text-gray-700 placeholder-gray-400"
                />
                <button
                    onClick={sendMessage}
                    className="w-12 h-12 bg-[#023E8A] text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                </button>
            </div>
        </div>
    );
}

export default ChatComponent;
