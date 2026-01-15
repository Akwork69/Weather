import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X, Star, Clock, TrendingUp } from 'lucide-react';

interface CitySearchProps {
  onSearch: (city: string) => void;
  recentSearches: string[];
  favorites: string[];
  onToggleFavorite: (city: string) => void;
  isFavorite: (city: string) => boolean;
  loading?: boolean;
}

const POPULAR_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
];

const CitySearch = ({
  onSearch,
  recentSearches,
  favorites,
  onToggleFavorite,
  isFavorite,
  loading = false,
}: CitySearchProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on query
  useEffect(() => {
    if (query.length > 0) {
      const filtered = POPULAR_CITIES.filter(city =>
        city.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsFocused(false);
    }
  }, [query, onSearch]);

  const handleSelectCity = useCallback((city: string) => {
    setQuery(city);
    onSearch(city);
    setIsFocused(false);
  }, [onSearch]);

  const clearQuery = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, []);

  const showDropdown = isFocused && (
    query.length > 0 || 
    recentSearches.length > 0 || 
    favorites.length > 0
  );

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto z-50">
      <form onSubmit={handleSubmit}>
        <motion.div
          className="relative"
          animate={{
            scale: isFocused ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="w-5 h-5" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search any city..."
            className="search-input pl-14 pr-12"
            disabled={loading}
          />

          <AnimatePresence>
            {query && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={clearQuery}
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 glass-card p-4 space-y-4"
          >
            {/* Suggestions from query */}
            {suggestions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <TrendingUp className="w-3 h-3" />
                  <span>Suggestions</span>
                </div>
                <div className="space-y-1">
                  {suggestions.map(city => (
                    <motion.button
                      key={city}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                      onClick={() => handleSelectCity(city)}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{city}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(city);
                        }}
                        className="p-1 hover:text-primary transition-colors"
                      >
                        <Star
                          className={`w-4 h-4 ${isFavorite(city) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                        />
                      </button>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent searches */}
            {!query && recentSearches.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Clock className="w-3 h-3" />
                  <span>Recent</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(city => (
                    <motion.button
                      key={city}
                      className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-sm transition-colors"
                      onClick={() => handleSelectCity(city)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {city}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Favorites */}
            {!query && favorites.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Star className="w-3 h-3" />
                  <span>Favorites</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {favorites.map(city => (
                    <motion.button
                      key={city}
                      className="px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-sm text-primary transition-colors flex items-center gap-2"
                      onClick={() => handleSelectCity(city)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      {city}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CitySearch;
