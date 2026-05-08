"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CopyIcon, GripVerticalIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ExerciseIcon } from "@/components/exercise/exercise-icon";
import { MuscleGroupTag } from "@/components/exercise/muscle-group-tag";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  deleteWorkoutAction,
  duplicateWorkoutAction,
  saveWorkoutItemsAction,
  updateWorkoutAction,
} from "../actions";
import { ExercisePicker } from "./exercise-picker";

const DAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];

export type BuilderItem = {
  id: string;
  exercise_id: string;
  exercise_name: string;
  muscle_group: string | null;
  sets: number;
  reps: string;
  rest_seconds: number | null;
  load_suggestion: string | null;
  notes: string | null;
  mode: "reps" | "seconds";
};

type Workout = {
  id: string;
  title: string;
  description: string | null;
  scheduled_days: number[] | null;
  active: boolean | null;
  student_id: string | null;
};

type Exercise = {
  id: string;
  name: string;
  muscle_group: string | null;
  equipment: string | null;
};

export function WorkoutBuilder({
  workout,
  items: initialItems,
  students,
  exercises,
}: {
  workout: Workout;
  items: BuilderItem[];
  students: { id: string; full_name: string }[];
  exercises: Exercise[];
}) {
  const t = useTranslations("workouts");
  const tc = useTranslations("common");
  const [title, setTitle] = useState(workout.title);
  const [studentId, setStudentId] = useState<string | "">(workout.student_id ?? "");
  const [days, setDays] = useState<Set<number>>(
    new Set(workout.scheduled_days ?? []),
  );
  const [active, setActive] = useState(workout.active ?? true);
  const [description, setDescription] = useState(workout.description ?? "");

  const [items, setItems] = useState<BuilderItem[]>(initialItems);
  const [editingItem, setEditingItem] = useState<BuilderItem | null>(null);
  const [picking, setPicking] = useState(false);
  const [pending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active: a, over } = e;
    if (!over || a.id === over.id) return;
    setItems((prev) => {
      const oldIndex = prev.findIndex((it) => it.id === a.id);
      const newIndex = prev.findIndex((it) => it.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const addExercise = (ex: Exercise) => {
    const newItem: BuilderItem = {
      id: crypto.randomUUID(),
      exercise_id: ex.id,
      exercise_name: ex.name,
      muscle_group: ex.muscle_group,
      sets: 3,
      reps: "10-12",
      rest_seconds: 60,
      load_suggestion: null,
      notes: null,
      mode: "reps",
    };
    setItems((prev) => [...prev, newItem]);
    setPicking(false);
  };

  const updateItem = (updated: BuilderItem) => {
    setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
    setEditingItem(null);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setEditingItem(null);
  };

  const toggleDay = (day: number) => {
    setDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const onSave = () => {
    startTransition(async () => {
      const meta = await updateWorkoutAction({
        id: workout.id,
        title,
        description: description || null,
        student_id: studentId || null,
        scheduled_days: Array.from(days).sort((a, b) => a - b),
        active,
      });
      if (meta.error) {
        toast.error(meta.error);
        return;
      }
      const itemsRes = await saveWorkoutItemsAction({
        workout_id: workout.id,
        items: items.map((it, idx) => ({
          id: it.id,
          exercise_id: it.exercise_id,
          position: idx,
          sets: it.sets,
          reps: it.reps,
          rest_seconds: it.rest_seconds,
          load_suggestion: it.load_suggestion,
          notes: it.notes,
          mode: it.mode,
        })),
      });
      if (itemsRes.error) {
        toast.error(itemsRes.error);
        return;
      }
      toast.success(t("builder_saved"));
    });
  };

  return (
    <>
      <header className="flex flex-col gap-4 rounded-xl border border-border bg-card/40 p-4 md:p-6">
        <input
          aria-label={t("builder_title_label")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-transparent font-display text-3xl leading-tight text-foreground outline-none placeholder:text-muted-foreground md:text-4xl"
          placeholder={t("builder_title_placeholder")}
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 flex-col gap-1">
            <Label
              htmlFor="student_id"
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
            >
              {t("builder_student_label")}
            </Label>
            <select
              id="student_id"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-base"
            >
              <option value="">{t("builder_template_option")}</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t("builder_days_label")}
            </Label>
            <div className="flex gap-1">
              {DAY_LABELS.map((label, idx) => {
                const on = days.has(idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleDay(idx)}
                    aria-pressed={on}
                    className={`grid size-9 place-items-center rounded-md text-sm transition-colors ${
                      on
                        ? "bg-[var(--brand-primary)] text-white"
                        : "bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <Textarea
          aria-label={t("builder_description_label")}
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("builder_description_placeholder")}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="size-4 accent-[var(--brand-primary)]"
          />
          {t("builder_active_label")}
        </label>
      </header>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={items.map((it) => it.id)} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-2">
            {items.map((it) => (
              <SortableItem
                key={it.id}
                item={it}
                onEdit={() => setEditingItem(it)}
                onDelete={() => removeItem(it.id)}
                dragLabel={t("builder_drag_label")}
                editLabel={t("builder_edit_item")}
                removeLabel={t("builder_remove_item")}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={() => setPicking(true)}
        className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/30 px-4 py-4 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
      >
        <PlusIcon className="size-4" /> {t("builder_add_exercise")}
      </button>

      <div className="sticky bottom-[calc(72px+env(safe-area-inset-bottom))] z-20 flex flex-wrap justify-end gap-2 rounded-xl border border-border bg-background/90 p-3 backdrop-blur md:bottom-4">
        <form action={deleteWorkoutAction}>
          <input type="hidden" name="id" value={workout.id} />
          <Button type="submit" variant="ghost" size="sm">
            <TrashIcon className="size-4" /> {t("builder_delete")}
          </Button>
        </form>
        <form action={duplicateWorkoutAction}>
          <input type="hidden" name="id" value={workout.id} />
          <Button type="submit" variant="outline" size="sm">
            <CopyIcon className="size-4" /> {t("builder_duplicate")}
          </Button>
        </form>
        <Button onClick={onSave} disabled={pending} size="lg">
          {pending ? tc("saving") : t("builder_save")}
        </Button>
      </div>

      <ExercisePicker
        open={picking}
        onOpenChange={setPicking}
        exercises={exercises}
        excludeIds={items.map((it) => it.exercise_id)}
        onPick={addExercise}
      />

      <EditItemSheet
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={updateItem}
        onDelete={removeItem}
      />
    </>
  );
}

function SortableItem({
  item,
  onEdit,
  onDelete,
  dragLabel,
  editLabel,
  removeLabel,
}: {
  item: BuilderItem;
  onEdit: () => void;
  onDelete: () => void;
  dragLabel: string;
  editLabel: string;
  removeLabel: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-stretch overflow-hidden rounded-xl border bg-card/40 transition-shadow ${
        isDragging
          ? "border-[var(--brand-primary)]/50 shadow-lg shadow-[var(--brand-primary)]/20"
          : "border-border"
      }`}
    >
      <button
        type="button"
        aria-label={dragLabel}
        className="flex shrink-0 cursor-grab touch-none items-center justify-center px-2 text-muted-foreground active:cursor-grabbing hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon className="size-5" />
      </button>

      <span className="grid shrink-0 place-items-center self-center">
        <span className="grid size-10 place-items-center rounded-lg border border-border bg-background/60">
          <ExerciseIcon muscleGroup={item.muscle_group} size={5} />
        </span>
      </span>

      <button
        type="button"
        onClick={onEdit}
        className="flex flex-1 flex-col items-start gap-1 px-3 py-3 text-left"
      >
        <span className="font-medium leading-tight text-foreground">
          {item.exercise_name}
        </span>
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="rounded-full border border-[var(--brand-primary)]/30 bg-[var(--brand-primary)]/10 px-2 py-0.5 font-semibold text-foreground tabular-nums">
            {item.sets}× {item.reps}
          </span>
          {item.rest_seconds ? (
            <span className="rounded-full border border-border bg-card/60 px-2 py-0.5 tabular-nums">
              {item.rest_seconds}s
            </span>
          ) : null}
          {item.load_suggestion ? (
            <span className="rounded-full border border-border bg-card/60 px-2 py-0.5">
              {item.load_suggestion}
            </span>
          ) : null}
          {item.muscle_group ? (
            <MuscleGroupTag muscleGroup={item.muscle_group} showIcon={false} />
          ) : null}
        </div>
      </button>

      <div className="flex">
        <button
          type="button"
          onClick={onEdit}
          aria-label={editLabel}
          className="grid w-10 place-items-center text-muted-foreground transition-colors hover:text-foreground"
        >
          <PencilIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={removeLabel}
          className="grid w-10 place-items-center text-muted-foreground transition-colors hover:text-destructive"
        >
          <TrashIcon className="size-4" />
        </button>
      </div>
    </li>
  );
}

function EditItemSheet({
  item,
  onClose,
  onSave,
  onDelete,
}: {
  item: BuilderItem | null;
  onClose: () => void;
  onSave: (it: BuilderItem) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Sheet open={!!item} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        className="max-h-[92dvh] overflow-y-auto rounded-t-2xl border-border bg-card pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:max-w-lg sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:rounded-2xl"
      >
        {item ? (
          <>
            <SheetHeader>
              <SheetTitle className="font-display text-2xl">
                {item.exercise_name}
              </SheetTitle>
              <SheetDescription>{item.muscle_group ?? ""}</SheetDescription>
            </SheetHeader>
            <ItemForm
              item={item}
              onSave={onSave}
              onDelete={() => onDelete(item.id)}
            />
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function ItemForm({
  item,
  onSave,
  onDelete,
}: {
  item: BuilderItem;
  onSave: (it: BuilderItem) => void;
  onDelete: () => void;
}) {
  const t = useTranslations("workouts");
  const [draft, setDraft] = useState<BuilderItem>(item);

  const set = <K extends keyof BuilderItem>(k: K, v: BuilderItem[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <div className="flex items-center gap-1 self-start rounded-lg border border-border bg-background p-1 text-xs">
        {(["reps", "seconds"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => set("mode", m)}
            aria-pressed={draft.mode === m}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              draft.mode === m
                ? "bg-[var(--brand-primary)] text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m === "reps" ? t("builder_mode_reps") : t("builder_mode_time")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sets">{t("builder_sets")}</Label>
          <Input
            id="sets"
            type="number"
            inputMode="numeric"
            min={1}
            max={20}
            value={draft.sets}
            onChange={(e) => set("sets", Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reps">
            {draft.mode === "seconds" ? t("builder_time") : t("builder_reps")}
          </Label>
          <Input
            id="reps"
            value={draft.reps}
            onChange={(e) => set("reps", e.target.value)}
            placeholder={draft.mode === "seconds" ? "30s" : "10-12"}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="rest">{t("builder_rest")}</Label>
          <Input
            id="rest"
            type="number"
            inputMode="numeric"
            min={0}
            max={600}
            value={draft.rest_seconds ?? ""}
            onChange={(e) =>
              set(
                "rest_seconds",
                e.target.value === "" ? null : Math.max(0, Number(e.target.value)),
              )
            }
            placeholder="60"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="load">{t("builder_load")}</Label>
        <Input
          id="load"
          value={draft.load_suggestion ?? ""}
          onChange={(e) => set("load_suggestion", e.target.value || null)}
          placeholder={t("builder_load_placeholder")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">{t("builder_notes")}</Label>
        <Textarea
          id="notes"
          rows={3}
          value={draft.notes ?? ""}
          onChange={(e) => set("notes", e.target.value || null)}
          placeholder={t("builder_notes_placeholder")}
        />
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onDelete}>
          {t("builder_remove")}
        </Button>
        <Button onClick={() => onSave(draft)} size="lg">
          {t("builder_save_item")}
        </Button>
      </div>
    </div>
  );
}
