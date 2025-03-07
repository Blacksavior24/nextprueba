export interface paginationDto{
    filters?: Record<string, string>, search?: string, searchBy?: string[], page: number, limit: number
}