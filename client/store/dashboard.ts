import { create } from "zustand";
import { persist } from "zustand/middleware";
import data from "../data/dashboard.json";

export type Widget = {
  id: string;
  name: string;
  text: string;
  chart?: { type: "doughnut" | "bar"; data: any; options?: any } | null;
};
export type Category = { id: string; name: string; widgetIds: string[] };

export interface DashboardState {
  categories: Record<string, Category>;
  categoryOrder: string[];
  widgets: Record<string, Widget>;
  searchQuery: string;
  // derived helpers
  getCategory: (id: string) => Category | undefined;
  getWidgetsForCategory: (id: string) => Widget[];
  getAllWidgets: () => Widget[];
  getAvailableWidgetsForCategory: (id: string) => Widget[];
  // mutations
  addWidgetToCategory: (
    categoryId: string,
    widget: { name: string; text: string; id?: string },
  ) => string;
  removeWidgetFromCategory: (categoryId: string, widgetId: string) => void;
  toggleWidgetInCategory: (
    categoryId: string,
    widgetId: string,
    checked: boolean,
  ) => void;
  setSearchQuery: (q: string) => void;
  resetToDefaults: () => void;
}

function arrayUnique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function normalize() {
  const categories: Record<string, Category> = {};
  const widgets: Record<string, Widget> = {};
  for (const c of data.categories)
    categories[c.id] = { ...c, widgetIds: [...c.widgetIds] };
  for (const w of data.widgets) widgets[w.id] = w;
  const categoryOrder = data.categories.map((c) => c.id);
  return { categories, widgets, categoryOrder } as const;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => {
      const init = normalize();
      return {
        categories: init.categories,
        categoryOrder: init.categoryOrder,
        widgets: init.widgets,
        searchQuery: "",
        getCategory: (id) => get().categories[id],
        getWidgetsForCategory: (id) => {
          const cat = get().categories[id];
          if (!cat) return [];
          return cat.widgetIds.map((wid) => get().widgets[wid]).filter(Boolean);
        },
        getAllWidgets: () => Object.values(get().widgets),
        getAvailableWidgetsForCategory: (id) => {
          const cat = get().categories[id];
          if (!cat) return [];
          return Object.values(get().widgets).filter(
            (w) => !cat.widgetIds.includes(w.id),
          );
        },
        addWidgetToCategory: (categoryId, widget) => {
          const id =
            widget.id ??
            widget.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") +
              "-" +
              Math.random().toString(36).slice(2, 7);
          set((state) => {
            const exists = state.widgets[id];
            const newWidgets = { ...state.widgets };
            if (!exists)
              newWidgets[id] = {
                id,
                name: widget.name,
                text: widget.text,
              } as Widget;
            const cat = state.categories[categoryId];
            if (!cat) return state;
            const newCat: Category = {
              ...cat,
              widgetIds: arrayUnique([...cat.widgetIds, id]),
            };
            return {
              ...state,
              widgets: newWidgets,
              categories: { ...state.categories, [categoryId]: newCat },
            };
          });
          return id;
        },
        removeWidgetFromCategory: (categoryId, widgetId) => {
          set((state) => {
            const cat = state.categories[categoryId];
            if (!cat) return state;
            const newCat: Category = {
              ...cat,
              widgetIds: cat.widgetIds.filter((id) => id !== widgetId),
            };
            return {
              ...state,
              categories: { ...state.categories, [categoryId]: newCat },
            };
          });
        },
        toggleWidgetInCategory: (categoryId, widgetId, checked) => {
          if (checked)
            get().addWidgetToCategory(categoryId, {
              id: widgetId,
              name: get().widgets[widgetId]?.name ?? widgetId,
              text: get().widgets[widgetId]?.text ?? "",
            });
          else get().removeWidgetFromCategory(categoryId, widgetId);
        },
        setSearchQuery: (q) => set({ searchQuery: q }),
        resetToDefaults: () =>
          set(() => {
            const init = normalize();
            return {
              categories: init.categories,
              categoryOrder: init.categoryOrder,
              widgets: init.widgets,
              searchQuery: "",
            } as DashboardState;
          }),
      };
    },
    {
      name: "dashboard-store",
      version: 2,
      migrate: (persisted: any, fromVersion: number) => {
        try {
          if (!persisted || fromVersion < 2) {
            const init = normalize();
            return { ...init, searchQuery: "" } as DashboardState;
          }
          return persisted as DashboardState;
        } catch {
          const init = normalize();
          return { ...init, searchQuery: "" } as DashboardState;
        }
      },
    },
  ),
);
