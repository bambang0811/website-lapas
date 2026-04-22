const BASE_URL = "http://localhost:5000/api/pejabat";

async function getPejabat() {
  const res = await fetch(BASE_URL);
  return res.json();
}

async function addPejabat(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    body: data,
  });

  if (!res.ok) throw new Error(await res.text());
}

async function updatePejabat(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: data,
  });

  if (!res.ok) throw new Error(await res.text());
}

async function deletePejabat(id) {
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
}

export default { getPejabat, addPejabat, updatePejabat, deletePejabat };