import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Heart } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

// ✅ API setup
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const { getToken } = useAuth();

  // 🔥 Fetch community creations
  const fetchCreations = async () => {
    try {
      const { data } = await axios.get("/api/user/get-published-creations");

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreations();
  }, []);

  // ❤️ Like / Unlike
  const handleLike = async (id) => {
    if (!user) {
      toast.error("Please login to like images");
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/user/toggle-like-creation",
        { id },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message); // 🔥 notification

        // Update UI instantly
        setCreations((prev) =>
          prev.map((item) => {
            if (item.id === id) {
              const liked = item.likes?.includes(user.id);

              return {
                ...item,
                likes: liked
                  ? item.likes.filter((u) => u !== user.id)
                  : [...(item.likes || []), user.id],
              };
            }
            return item;
          })
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ⏳ Loading state
  

  // 🚫 Empty state
  

  return !loading ? (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h2 className="text-xl font-semibold">Community Creations</h2>

      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll flex flex-wrap">
        {creations.map((creation) => (
          <div
            key={creation.id}
            className="relative group p-3 w-full sm:w-1/2 lg:w-1/3"
          >
            <img
              src={creation.content}
              alt="creation"
              className="w-full h-full object-cover rounded-lg"
            />

            <div
              className="absolute inset-0 flex items-end justify-end
              group-hover:justify-between p-3
              group-hover:bg-gradient-to-b from-transparent to-black/80
              text-white rounded-lg"
            >
              <p className="text-sm hidden group-hover:block">
                {creation.prompt}
              </p>

              <div className="flex items-center gap-1">
                <p>{creation.likes?.length || 0}</p>

                <Heart
                  onClick={() => handleLike(creation.id)}  // ✅ correct function
                  className={`w-5 h-5 cursor-pointer transition ${
                    creation.likes?.includes(user?.id)
                      ? "fill-red-500 text-red-600 scale-110"
                      : "text-white"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )  : (
  <div className="flex-1 h-full flex justify-center items-center">
    <span className=" w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin"></span>
  </div>)   

  
  }


export default Community;
