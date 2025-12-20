const handleClear = (setSearchTerm,inputRef) => {
    setSearchTerm("");
    inputRef.current?.focus();
  };

  const handleSelect = (item: any) => {
    setSearchTerm("");
    setUserChoice(item)
    onSelect?.(item);
  };