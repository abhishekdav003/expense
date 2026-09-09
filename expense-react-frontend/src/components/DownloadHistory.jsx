import { useEffect, useState } from "react";
import api from "../services/api";

function DownloadHistory() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchHistory = async () => {
    try {
      const response = await api.get("/expense/download/history");
      setDownloads(response.data.data || []);
    } catch (error) {
      console.error(
        error.response?.data?.message || "Failed to load download history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleOldDownload = async (id) => {
    try {
      setDownloadingId(id);

      const response = await api.get(`/expense/download/history/${id}`);

      window.open(response.data.data.url, "_blank");
    } catch (error) {
      console.error(
        error.response?.data?.message || "Failed to download file"
      );
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        Loading download history...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        Download History
      </h2>

      {downloads.length === 0 ? (
        <p className="text-gray-500">
          No previous downloads found.
        </p>
      ) : (
        <div className="space-y-3">
          {downloads.map((download) => (
            <div
              key={download.id}
              className="flex items-center justify-between border rounded-lg p-4"
            >
              <div>
                <p className="font-medium">
                  Expense Report
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(download.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => handleOldDownload(download.id)}
                disabled={downloadingId === download.id}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {downloadingId === download.id
                  ? "Downloading..."
                  : "Download"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DownloadHistory;