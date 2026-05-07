"use client";

import { MoreVerticalIcon, PinIcon, PinOffIcon, TrashIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { deletePostAction, togglePinAction } from "./actions";

export function PostMenu({ id, pinned }: { id: string; pinned: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="Opções do post"
            className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          />
        }
      >
        <MoreVerticalIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
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
  );
}
