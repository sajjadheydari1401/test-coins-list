import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../lib/api";
import { savePage, getPage } from "../lib/idb";

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  price: number;
  market_cap: number;
  volume_24h: number;
  change_24h: number | null;
  rank: number;
}

interface CoinsState {
  items: Coin[];
  status: "idle" | "loading" | "succeeded" | "failed";
  page: number;
  per_page: number;
}

const initialState: CoinsState = {
  items: [],
  status: "idle",
  page: 1,
  per_page: 10,
};

export const loadCachedPage = createAsyncThunk(
  "coins/loadCachedPage",
  async ({ page, per_page }: { page: number; per_page: number }, thunkAPI) => {
    const key = `coins:${page}:${per_page}`;
    const cached = await getPage(key);
    if (cached) return { data: cached, page, per_page, cached: true };

    // No cached data: immediately fetch from network so UI doesn't wait for the
    // interval-based refresh. We dispatch the existing fetchPage thunk and
    // return its payload (or a null payload on failure).
    const res: any = await thunkAPI.dispatch(
      // forceNetwork:true and silent:false so the UI updates immediately
      fetchPage({ page, per_page, forceNetwork: true, silent: false } as any)
    );

    return res && res.payload ? res.payload : { data: null, page, per_page };
  }
);

export const fetchPage = createAsyncThunk(
  "coins/fetchPage",
  async (
    {
      page,
      per_page,
      forceNetwork = false,
      silent = false,
    }: {
      page: number;
      per_page: number;
      forceNetwork?: boolean;
      silent?: boolean;
    },
    thunkAPI
  ) => {
    const key = `coins:${page}:${per_page}`;
    if (!forceNetwork) {
      const cached = await getPage(key);
      if (cached) return { data: cached, page, per_page, cached: true };
    }

    // Debug: indicate network fetch
    if (silent) {
      // silent fetches are background refreshes
      console.debug(
        `[coins] fetchPage (silent) network request page=${page} per_page=${per_page}`
      );
    } else {
      console.debug(
        `[coins] fetchPage network request page=${page} per_page=${per_page}`
      );
    }

    const res = await api.get("/coins", { params: { page, per_page } });
    const data = res.data.data;
    // save to idb
    await savePage(key, data);

    console.debug(
      `[coins] fetchPage network response page=${page} items=${
        Array.isArray(data) ? data.length : "n/a"
      }`
    );
    return { data, page, per_page, cached: false };
  }
);

const coinsSlice = createSlice({
  name: "coins",
  initialState,
  reducers: {
    setPerPage(state, action: PayloadAction<number>) {
      state.per_page = action.payload;
    },
    appendCoins(state, action: PayloadAction<Coin[]>) {
      state.items = state.items.concat(action.payload);
    },
    reset(state) {
      state.items = [];
      state.page = 1;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCachedPage.pending, (state) => {
        // Only show loading when we have no items yet (initial load)
        if (state.items.length === 0) state.status = "loading";
      })
      .addCase(loadCachedPage.fulfilled, (state, action: any) => {
        state.status = "succeeded";
        const incoming: Coin[] | null = action.payload.data;
        // Only apply cached data if we don't already have loaded items.
        if (incoming && state.items.length === 0) {
          state.items = incoming;
          state.page = action.payload.page;
        } else if (!incoming && state.items.length === 0) {
          // no cached data and nothing loaded yet
          state.items = [];
          state.page = action.payload.page;
        }
      })
      .addCase(loadCachedPage.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchPage.pending, (state, action: any) => {
        const silent: boolean = action.meta?.arg?.silent ?? false;
        if (!silent) state.status = "loading";
      })
      .addCase(fetchPage.fulfilled, (state, action: any) => {
        const incoming: Coin[] = action.payload.data;
        const incomingPage: number = action.payload.page;
        const silent: boolean = action.meta?.arg?.silent ?? false;
        if (!incoming) return;
        // If not silent, update status and UI as normal. If silent, only refresh cache
        // (cache saved in thunk) and avoid touching UI or status.
        if (!silent) {
          state.status = "succeeded";
          if (state.items.length === 0 || incomingPage === 1) {
            // replace for first page
            state.items = incoming;
          } else if (incomingPage > state.page) {
            // append for subsequent pages (Show More)
            state.items = state.items.concat(incoming);
          } else if (incomingPage === state.page) {
            // replace same page
            state.items = incoming;
          }
          state.page = incomingPage;
        }
      })
      .addCase(fetchPage.rejected, (state, action: any) => {
        const silent: boolean = action.meta?.arg?.silent ?? false;
        if (!silent) state.status = "failed";
      });
  },
});

export const { setPerPage, reset, appendCoins } = coinsSlice.actions;
export default coinsSlice.reducer;
