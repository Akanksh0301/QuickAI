import React, { useState } from 'react'
import Markdown from 'react-markdown'

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-4 max-w-5xl text-sm bg-white border
      border-gray-200 rounded-lg cursor-pointer"
    >
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="font-medium">{item.prompt}</h2>
          <p className="text-gray-500 text-xs">
            {item.type} · {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>

        <span className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB]
        px-4 py-1 rounded-full text-xs capitalize">
          {item.type}
        </span>
      </div>

      {expanded && (
        <div className="mt-3">
          {/* ✅ IMAGE */}
          {item.type === 'image' ? (
            <img
              src={item.content}
              alt="creation"
              className="w-full max-h-[500px] object-contain rounded-md border"
              loading="lazy"
            />
          ) : (
            /* ✅ TEXT / ARTICLE */
            <div className="reset-tw">
              <Markdown>{item.content}</Markdown>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CreationItem
