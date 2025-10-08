// Common types and interfaces used across the application

// Generic API Response wrapper
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

// Pagination types
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  field?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// File upload types
export interface FileUploadResponse {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface FileUploadRequest {
  file: File;
  folder?: string;
  maxSize?: number;
  allowedTypes?: string[];
}

// Search and filter common types
export interface DateRangeFilter {
  from?: string;
  to?: string;
}

export interface NumericRangeFilter {
  min?: number;
  max?: number;
}

export interface TextSearchFilter {
  keyword?: string;
  fields?: string[];
}

// Status types
export interface StatusOption {
  value: number;
  label: string;
  color?: string;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'datetime' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: string | number) => string | null;
  };
}

export interface FormState<T = Record<string, unknown>> {
  values: T;
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  isSubmitting: boolean;
  isValid: boolean;
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: {
    label: string;
    action: () => void;
  }[];
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
  data?: unknown;
}

// Table types
export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T | string;
  title: string;
  width?: string | number;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
}

export interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationParams;
  onPaginationChange?: (pagination: PaginationParams) => void;
  onSort?: (field: string, order: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, unknown>) => void;
  rowKey?: string | ((record: T) => string);
  rowSelection?: {
    type: 'checkbox' | 'radio';
    selectedRowKeys: string[];
    onSelect: (selectedRowKeys: string[], selectedRows: T[]) => void;
  };
}

// Modal types
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: string | number;
  centered?: boolean;
  closable?: boolean;
  maskClosable?: boolean;
}

// Drawer types
export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: string | number;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  closable?: boolean;
  maskClosable?: boolean;
}

// Chart types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area';
  data: ChartDataPoint[];
  options?: Record<string, unknown>;
}

// Export types
export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'pdf';
  filename?: string;
  columns?: string[];
  includeHeaders?: boolean;
}

// Import types
export interface ImportOptions {
  format: 'csv' | 'xlsx';
  file: File;
  mapping?: { [key: string]: string };
  validate?: boolean;
  preview?: boolean;
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  processedRows: number;
  errors: {
    row: number;
    field: string;
    message: string;
  }[];
  warnings: {
    row: number;
    field: string;
    message: string;
  }[];
}
