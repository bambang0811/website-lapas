const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

class PopupService {
  async getActive() {
    const response = await fetch(`${API_BASE_URL}/popup`);
    if (!response.ok) {
      throw new Error(`Failed to fetch popup: ${response.status}`);
    }
    return response.json();
  }

  async getAll() {
    const response = await fetch(`${API_BASE_URL}/popup/all`);
    if (!response.ok) {
      throw new Error(`Failed to fetch popup list: ${response.status}`);
    }
    return response.json();
  }

  async create(data) {
    const response = await fetch(`${API_BASE_URL}/popup`, {
      method: "POST",
      body: data,
    });
    if (!response.ok) {
      throw new Error(`Failed to create popup: ${response.status}`);
    }
    return response.json();
  }

  async update(id, data) {
    const response = await fetch(`${API_BASE_URL}/popup/${id}`, {
      method: "PUT",
      body: data,
    });
    if (!response.ok) {
      throw new Error(`Failed to update popup: ${response.status}`);
    }
    return response.json();
  }

  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/popup/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete popup: ${response.status}`);
    }
    return response.json();
  }
}

const popupService = new PopupService();
export default popupService;
