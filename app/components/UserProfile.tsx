"use client";

export default function UserProfile() {
//     const foodieMetaData = {
//       name,
//       description,
//       location,
//       type,
//       grade,
//       image_key: key,
//     };

//     const res = await fetch("http://localhost:8000/foods", {
//       method: "POST",
//       credentials: "include", // 👈 important if using auth cookies
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(foodieMetaData),
//     });

//     if (!res.ok) {
//       const err = await res.text();
//       throw new Error(err);
//     }

//     return res.json();
//   };

//   async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const selected = e.target.files?.[0];
//     if (!selected) return;

//     setSelectedFile(selected);
//     setPreview(URL.createObjectURL(selected));

//     setOpenMetaDialog(true);
//   }

//   const handleClose = () => {
//     setOpenMetaDialog(false);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!selectedFile) return;
//     const uploaded = await uploadImage(selectedFile); // ✅ immediate upload
//     const uploadFood = await uploadImageMetaData(uploaded.key);

//     console.log("uploadFood", uploadFood);

//     setFoodList((prev) => [uploadFood, ...prev]);

//     setOpenMetaDialog(false);
//   };

//   console.log("foodItems", foodItems);

  return (
    <h1>hello</h1>
  );
}
