import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

function ChatComponent({ itemId, senderName, receiverName, itemName, onClose }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const messagesEndRef = useRef(null);

    //sorts the usernames alphabetically to create a unique room id
    const getRoomId = (itemId, user1, user2) => {
        const users = [user1, user2].sort();
        return `${itemId}-${users[0]}-${users[1]}`;
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messageList]);

    useEffect(() => {
        if (!itemId || !senderName || !receiverName) return;

        const roomId = getRoomId(itemId, senderName, receiverName);
        
        // Join the unique private chat room for this item + pair of users
        socket.emit("join_room", roomId);

        // get chat history from the database.
        const fetchMessages = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/messages/${itemId}?user1=${encodeURIComponent(senderName)}&user2=${encodeURIComponent(receiverName)}`);
                if (res.ok) {
                    const data = await res.json();
                    setMessageList(data);
                }
            } catch (error) {
                console.error("Error fetching private messages:", error);
            }
        };
        fetchMessages();

        // Real-time message listener(update chat according to new message)
        const eventListener = (data) => {
            const currentRoom = getRoomId(itemId, senderName, receiverName);
            const incomingRoom = getRoomId(data.itemId, data.senderName, data.receiverName);
            
            if (incomingRoom === currentRoom) {
                setMessageList((list) => [...list, data]);
            }
        };
        socket.on("receive_message", eventListener);

        return () => {
            socket.off("receive_message", eventListener);
        };
    }, [itemId, senderName, receiverName]);

    const sendMessage = async () => {
        if (currentMessage.trim() !== "") {
            const roomId = getRoomId(itemId, senderName, receiverName);
            const messageData = {
                itemId: itemId,
                senderName: senderName,
                receiverName: receiverName,
                text: currentMessage,
                room: roomId
            };

            await socket.emit("send_message", messageData);
            setCurrentMessage("");
        }
    };

    return (
        <div className="fixed bottom-6 right-6 w-[400px] h-[580px] bg-white rounded-[40px] shadow-2xl flex flex-col overflow-hidden z-[1000] border-8 border-white animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="p-8 bg-[#023E8A] text-white flex justify-between items-center shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center font-black text-2xl backdrop-blur-xl border border-white/20 shadow-inner">
                        {itemName?.charAt(0) || 'C'}
                    </div>
                    <div>
                        <h3 className="font-black text-base uppercase tracking-widest leading-none mb-1">{itemName}</h3>
                        <p className="text-[9px] font-black text-blue-200/60 uppercase tracking-[0.2em]">Private chat with {receiverName}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-rose-500/80 transition-all font-black relative z-10"
                >
                    ✕
                </button>
                {/* Decorative blob */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"></div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50 scrollbar-hide">
                {messageList.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-10">
                        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-800">No messages yet</p>
                        <p className="text-[8px] font-bold text-slate-500 mt-1">Start a conversation about this item</p>
                    </div>
                )}
                {messageList.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex flex-col ${msg.senderName === senderName ? 'items-end' : 'items-start'}`}
                    >
                        <div
                            className={`max-w-[85%] p-4 rounded-3xl shadow-sm text-sm font-medium leading-relaxed ${msg.senderName === senderName
                                ? 'bg-[#023E8A] text-white rounded-tr-none'
                                : 'bg-white text-gray-700 border border-slate-100 rounded-tl-none'
                                }`}
                        >
                            {msg.text}
                        </div>
                        <span className={`text-[8px] font-black text-gray-400 mt-2 uppercase tracking-widest ${msg.senderName === senderName ? 'mr-1' : 'ml-1'}`}>
                            {msg.senderName} • {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-6 bg-white border-t border-slate-50 flex items-center gap-4">
                <input
                    type="text"
                    value={currentMessage}
                    placeholder="Type a private message..."
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-[28px] px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#023E8A] text-gray-700 placeholder-gray-400 transition-all"
                />
                <button
                    onClick={sendMessage}
                    disabled={!currentMessage.trim()}
                    className="w-14 h-14 bg-[#023E8A] text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                </button>
            </div>
        </div>
    );
}

export default ChatComponent;
