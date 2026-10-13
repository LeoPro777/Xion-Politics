import { create } from 'zustand';

interface FilterState {
  municipioId: number | null;
  parroquiaId: number | null;
  searchTerm: string;
  setMunicipioId: (id: number | null) => void;
  setParroquiaId: (id: number | null) => void;
  setSearchTerm: (term: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  municipioId: null,
  parroquiaId: null,
  searchTerm: '',
  setMunicipioId: (id) => set({ municipioId: id, parroquiaId: null }),
  setParroquiaId: (id) => set({ parroquiaId: id }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  resetFilters: () => set({ municipioId: null, parroquiaId: null, searchTerm: '' }),
}));
