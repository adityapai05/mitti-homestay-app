"use client";

import { format } from "date-fns";
import { Mail, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/prebuilt-components/alert-dialog";

type AdminContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function ContactMessagesTable({
  messages,
  selected,
  onSelect,
}: {
  messages: AdminContactMessage[];
  selected: AdminContactMessage | null;
  onSelect: (m: AdminContactMessage) => void;
}) {
  const [deleting, setDeleting] = useState(false);

  async function openMessage(m: AdminContactMessage) {
    onSelect(m);

    if (!m.isRead) {
      await fetch(`/api/admin/contact/${m.id}/read`, {
        method: "PATCH",
      });
      m.isRead = true;
    }
  }

  async function deleteMessage(id: string) {
    setDeleting(true);

    await fetch(`/api/admin/contact/${id}`, {
      method: "DELETE",
    });

    window.location.reload();
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Message list */}
      <div className="border border-mitti-khaki rounded-xl bg-mitti-cream min-h-[420px] flex flex-col">
        {messages.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center text-center px-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-mitti-beige">
              <Mail size={20} className="text-mitti-brown" />
            </div>

            <p className="text-sm font-medium text-mitti-dark-brown">
              No contact messages
            </p>

            <p className="mt-1 text-sm text-mitti-dark-brown/60 max-w-xs">
              Messages submitted via the contact form will appear here.
            </p>
          </div>
        )}

        {messages.map((m) => (
          <button
            key={m.id}
            onClick={() => openMessage(m)}
            className={`w-full text-left px-4 py-3 border-b border-mitti-khaki transition cursor-pointer
              ${
                selected?.id === m.id
                  ? "bg-mitti-beige"
                  : "hover:bg-mitti-beige"
              }`}
          >
            <p
              className={`text-sm font-medium truncate ${
                m.isRead ? "text-mitti-dark-brown/60" : "text-mitti-dark-brown"
              }`}
            >
              {m.subject}
            </p>

            <p className="text-xs text-mitti-dark-brown/60">{m.name}</p>

            <p className="text-xs text-mitti-dark-brown/50 mt-1">
              {format(new Date(m.createdAt), "dd MMM yyyy")}
            </p>
          </button>
        ))}
      </div>

      {/* Message detail */}
      <div className="col-span-2 border border-mitti-khaki rounded-xl bg-mitti-cream p-6 min-h-[420px]">
        {selected ? (
          <>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-mitti-dark-brown">
                  {selected.subject}
                </h2>
                <p className="text-sm text-mitti-dark-brown/70">
                  From {selected.name} • {selected.email}
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="text-mitti-error hover:text-mitti-error/80 transition cursor-pointer"
                    aria-label="Delete message"
                  >
                    <Trash2 size={18} />
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent className="bg-mitti-cream border-mitti-khaki">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-mitti-dark-brown">
                      Delete contact message
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-mitti-dark-brown/70">
                      This action is permanent and cannot be undone. The message
                      will be removed from the system.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-mitti-khaki cursor-pointer">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteMessage(selected.id)}
                      disabled={deleting}
                      className="bg-mitti-error text-white hover:bg-mitti-error/90 cursor-pointer"
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="whitespace-pre-wrap text-mitti-dark-brown/80 leading-relaxed">
              {selected.message}
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-8">
            <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-mitti-beige">
              <Mail className="text-mitti-brown" size={20} />
            </div>

            <p className="text-sm font-medium text-mitti-dark-brown">
              No message selected
            </p>

            <p className="mt-1 text-sm text-mitti-dark-brown/60 max-w-xs">
              Select a message from the list to view its details here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
