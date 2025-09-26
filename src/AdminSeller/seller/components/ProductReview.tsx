// import { useEffect, useState } from "react";
// import supabase from "../../../supabase";
// import { Input } from "../../admin/ui/input";
// import { Button } from "../../admin/ui/button";
// import { Label } from "../../admin/ui/label";

// export default function ProductReviews({ productId }: { productId: string }) {
//   const [reviews, setReviews] = useState<any[]>([]);
//   const [comment, setComment] = useState("");
//   const [rating, setRating] = useState(5);

//   useEffect(() => {
//     const loadReviews = async () => {
//       const { data, error } = await supabase
//         .from("reviews")
//         .select("*, users(full_name)")
//         .eq("product_id", productId)
//         .order("created_at", { ascending: false });
//       if (!error && data) setReviews(data);
//     };

//     loadReviews();
//   }, [productId]);

//   const submitReview = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const { data, error } = await supabase.from("reviews").insert([
//       {
//         product_id: productId,
//         rating,
//         comment,
//         user_id: "replace-with-logged-in-user-id",
//       },
//     ]);

//     if (!error && data) {
//       setReviews((prev) => [...data, ...prev]);
//       setComment("");
//       setRating(5);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 space-y-6">
//       <h2 className="text-2xl font-bold">Customer Reviews</h2>

//       {/* Review Form */}
//       <form onSubmit={submitReview} className="space-y-4 border p-4 rounded-md">
//         <div>
//           <Label>Rating (1-5)</Label>
//           <Input
//             type="number"
//             min={1}
//             max={5}
//             value={rating}
//             onChange={(e) => setRating(Number(e.target.value))}
//           />
//         </div>
//         <div>
//           <Label>Comment</Label>
//           <Input
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             placeholder="Write your review..."
//           />
//         </div>
//         <Button type="submit">Submit Review</Button>
//       </form>

//       {/* Reviews List */}
//       <div className="space-y-3">
//         {reviews.length === 0 ? (
//           <p className="text-muted-foreground">No reviews yet.</p>
//         ) : (
//           reviews.map((r) => (
//             <div key={r.id} className="border rounded-lg p-3">
//               <p className="font-medium">
//                 {r.users?.full_name || "Anonymous"} ⭐ {r.rating}/5
//               </p>
//               <p className="text-sm text-muted-foreground">{r.comment}</p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
