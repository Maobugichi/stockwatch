import React, { createContext,  useEffect, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/axios-config';
import type { UserChoiceTypeWatch } from '@/types';

interface StockDashboardContextType {
  data: any;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<any>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  refreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
  selectedStock: any;
  setSelectedStock: (stock: any) => void;
  userChoice: UserChoiceTypeWatch;
  setUserChoice: (choice: UserChoiceTypeWatch) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleRefresh: () => Promise<void>;
  handleClear:(inputRef:any) => void
  handleSelect:(item: any) => void
}

export const StockDashboardContext = createContext<StockDashboardContextType | undefined>(undefined);

interface StockDashboardProviderProps {
  children: ReactNode;
  queryKey?: string[];
  apiEndpoint?: string;
}

export const StockDashboardProvider: React.FC<StockDashboardProviderProps> = ({
  children,
  queryKey = ['port'],
  apiEndpoint = '/api/trending-stock',
}) => {
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await api.get(apiEndpoint);
      return response.data;
    },
  });


  const [searchTerm, setSearchTerm] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [userChoice, setUserChoice] = useState<UserChoiceTypeWatch>({
    ticker: '',
  });
  const [activeTab, setActiveTab] = useState<string>('overview');

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

    const handleClear = (inputRef:any) => {
    setSearchTerm("");
    inputRef.current?.focus();
  };

  const handleSelect = (item: any) => {
    setSearchTerm("");
    setUserChoice(item)
    
  };
  
  useEffect(() => {
    if (isError) {
      navigate('/login');
    }
  }, [isError, navigate]);

  const value = {
    data,
    isLoading,
    isError,
    refetch,
    searchTerm,
    setSearchTerm,
    refreshing,
    setRefreshing,
    selectedStock,
    setSelectedStock,
    userChoice,
    setUserChoice,
    activeTab,
    setActiveTab,
    handleRefresh,
    handleClear,
    handleSelect
  };

  return (
    <StockDashboardContext.Provider value={value}>
      {children}
    </StockDashboardContext.Provider>
  );
};