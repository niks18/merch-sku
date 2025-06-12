import api from './config';

export const skuService = {
    // Get all SKUs
    getAllSkus: async () => {
        try {
            const response = await api.get('/skus/');
            return response.data;
        } catch (error) {
            console.error('Error fetching SKUs:', error);
            throw error;
        }
    },

    // Get a single SKU by ID
    getSkuById: async (id) => {
        try {
            const response = await api.get(`/skus/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching SKU ${id}:`, error);
            throw error;
        }
    },

    // Create a new SKU
    createSku: async (skuData) => {
        try {
            const response = await api.post('/skus/', skuData);
            return response.data;
        } catch (error) {
            console.error('Error creating SKU:', error);
            throw error;
        }
    },

    // Update an existing SKU
    updateSku: async (id, skuData) => {
        try {
            const response = await api.put(`/skus/${id}/`, skuData);
            return response.data;
        } catch (error) {
            console.error(`Error updating SKU ${id}:`, error);
            throw error;
        }
    },

    // Delete a SKU
    deleteSku: async (id) => {
        try {
            await api.delete(`/skus/${id}/`);
        } catch (error) {
            console.error(`Error deleting SKU ${id}:`, error);
            throw error;
        }
    }
}; 