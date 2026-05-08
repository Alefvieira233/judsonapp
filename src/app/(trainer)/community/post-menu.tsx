"use client";

import { useState } from "react";
import { MoreVerticalIcon, PencilIcon, PinIcon, PinOffIcon, TrashIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { deletePostAction, togglePinAction } from "./actions";
import { EditPostSheet } from "./edit-post-sheet";

type Props = {
  id: string;
  pinned: boolean;
  content: string;
  media_url: string | null;
  media_type: string | null;
};

export function PostMenu({ id, pinned, content, media_url, media_type }: Props) {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <DropdownMenu>
        {/* Children-only trigger — Base UI generates the button. The
            render={<button/>} + children pattern was dropping onClick on
            some mobile browsers (same root cause as more-sheet.tsx). */}
        <DropdownMenuTrigger
          aria-label="Opções do post"
          className="grid size-11 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
        >
          <MoreVerticalIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[10rem]">
          <DropdownMenuItem
            render={
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex w-full items-center gap-2 px-2 py-1.5 text-sm"
              >
                <PencilIcon className="size-4" /> Editar
              </button>
            }
          />
          <DropdownMenuItem
            render={
              <form action={togglePinAction}>
                <input type="hidden" name="id" value={id} />
                <input type="hidden" name="pinned" value={String(pinned)} />
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 px-2 py-1.5 text-sm"
                >
                  {pinned ? (
                    <>
                      <PinOffIcon className="size-4" /> Desafixar
                    </>
                  ) : (
                    <>
                      <PinIcon className="size-4" /> Fixar
                    </>
                  )}
                </button>
              </form>
            }
          />
          <DropdownMenuItem
            render={
              <form action={deletePostAction}>
                <input type="hidden" name="id" value={id} />
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-destructive"
                >
                  <TrashIcon className="size-4" /> Apagar
                </button>
              </form>
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <EditPostSheet
        open={editing}
        onOpenChange={setEditing}
        post={{ id, content, media_url, media_type }}
      />
    </>
  );
}
