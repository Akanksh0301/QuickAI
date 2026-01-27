import sql from "../config/db.js";

export const getUserCreations = async (req, res) => { 
  try {
    const { userId } = req.auth();

    const creations = await sql `SELECT * FROM Creations WHERE user_id = ${userId} ORDER BY created_at DESC`;

    res.json({ success: true, creations });
  } catch (error) {
   
    res.json({ success: false, message: error.message });
  }
}

export const getPublishedCreations = async (req, res) => { 
  try {

    const creations = await sql `SELECT * FROM Creations WHERE publish = true ORDER BY created_at DESC`;

    res.json({ success: true, creations });
  } catch (error) {
   
    res.json({ success: false, message: error.message });
  }
}

export const toggleLikeCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const [creation] = await sql`
      SELECT * FROM Creations WHERE id = ${id}
    `;

    if (!creation) {
      return res.status(404).json({
        success: false,
        message: "Creation not found",
      });
    }

    const currentLikes = creation.likes || [];
    const userIdStr = userId.toString();

    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((u) => u !== userIdStr);
      message = "Like removed";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Like added";
    }

    // ✅ Convert JS array → Postgres TEXT[] literal
    const pgArray = `{${updatedLikes.map(v => `"${v}"`).join(',')}}`;

    await sql`
      UPDATE Creations
      SET likes = ${pgArray}
      WHERE id = ${id}
    `;

    res.json({ success: true, message });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


