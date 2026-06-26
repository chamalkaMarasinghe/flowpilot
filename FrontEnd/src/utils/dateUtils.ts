import { format, formatDistanceToNow, isPast, isToday, parseISO } from "date-fns";

export const fmtDate = (iso: string) => format(parseISO(iso), "MMM d, yyyy");
export const fmtDateTime = (iso: string) => format(parseISO(iso), "MMM d, yyyy p");
export const fromNow = (iso: string) => formatDistanceToNow(parseISO(iso), { addSuffix: true });
export const isOverdue = (iso: string) => isPast(parseISO(iso)) && !isToday(parseISO(iso));
