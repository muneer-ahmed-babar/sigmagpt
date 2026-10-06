import "./Chat.css";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    // Typing effect: shows the newest reply word by word instead of all at once
    useEffect(() => {
        // reply is null when an old thread is loaded, so show it without the typing effect
        if (reply === null) {
            setLatestReply(null);
            return;
        }

        if (!prevChats?.length) return;

        const content = reply.split(" "); // individual words

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));

            idx++;
            if (idx >= content.length) clearInterval(interval);
        }, 40);

        // Cleanup: stop the timer when a new reply arrives or the component unmounts
        return () => clearInterval(interval);
    }, [prevChats, reply]);

    return (
        <>
            {newChat && <h1>Start a New Chat!</h1>}
            <div className="chats">
                {/* All messages except the last one are shown normally. User text is plain, Gemini text is rendered as Markdown */}
                {
                    prevChats?.slice(0, -1).map((chat, idx) =>
                        <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
                            {
                                chat.role === "user" ?
                                <p className="userMessage">{chat.content}</p> :
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                            }
                        </div>
                    )
                }

                {/* The last message: animated while typing, normal when the typing is finished or a thread is loaded */}
                {
                    prevChats.length > 0 && (
                        <>
                            {
                                latestReply === null ? (
                                    <div className="gptDiv" key={"non-typing"}>
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length - 1].content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="gptDiv" key={"typing"}>
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                    </div>
                                )
                            }
                        </>
                    )
                }
            </div>
        </>
    );
}

export default Chat;