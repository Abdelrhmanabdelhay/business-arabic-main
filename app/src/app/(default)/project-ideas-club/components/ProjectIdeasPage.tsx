// "use client";

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Input } from "@nextui-org/input";
// import { Select, SelectItem } from "@nextui-org/select";
// import { Button } from "@nextui-org/button";
// import { Card, CardBody } from "@nextui-org/card";
// import { useRouter } from "next/navigation";
// import { FiSearch, FiHeart, FiEye, FiArrowRight } from "react-icons/fi";

// import { GetIdeas } from "@/lib/actions/ideas.actions";
// import { IdeaClub } from "@/types/ideas.types";
// import UniPagination, { PaginationMeta } from "@/components/PagesComponents/UniPagination/UniPagination";

// const ProjectIdeasPage = () => {
//   const router = useRouter();

//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit, setLimit] = useState(10);

//   const {
//     data: ideasData,
//     isPending,
//     isError,
//     isSuccess,
//     refetch,
//   } = GetIdeas({
//     limit,
//     page: currentPage,
//     selectedCategory: selectedCategory !== "all" ? selectedCategory : "",
//     keyword: searchQuery.trim() !== "" ? searchQuery : "",
//   });

//   const projectIdeas: IdeaClub[] = ideasData?.ideas || [];

//   const paginationMeta: PaginationMeta = {
//     currentPage: ideasData?.page ?? 1,
//     limit: ideasData?.limit ?? 10,
//     totalDocs: ideasData?.total ?? 0,
//     totalPages: Math.ceil((ideasData?.total ?? 0) / (ideasData?.limit ?? 10)),
//     hasNextPage: ideasData ? ideasData.page * ideasData.limit < ideasData.total : false,
//     hasPrevPage: ideasData ? ideasData.page > 1 : false,
//   };

//   const categories: { value: string; label: string }[] = [
//     { value: "all", label: "جميع الفئات" },
//     ...(ideasData?.categories || []).map((cat: string) => ({
//       value: cat,
//       label: cat,
//     })),
//   ];

//   useEffect(() => {
//     setCurrentPage(1); // reset to first page on filter change
//     refetch();
//   }, [selectedCategory, searchQuery]);

//   const IdeaCard: React.FC<{ idea: IdeaClub }> = ({ idea }) => {
//     const [isHovered, setIsHovered] = useState(false);

//     return (
//       <motion.div
//         layout
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.9 }}
//         whileHover={{ y: -5 }}
//         onHoverStart={() => setIsHovered(true)}
//         onHoverEnd={() => setIsHovered(false)}>
//         <Card className="overflow-hidden border border-gray-200 h-full">
//           <CardBody className="p-0">
//             <div className="relative h-48 overflow-hidden">
//               <img src={idea.image || "/placeholder.png"} alt={idea.name} className="w-full h-full object-cover" />
//               <div
//                 className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-300 ${
//                   isHovered ? "opacity-100" : "opacity-70"
//                 }`}
//               />
//               <div className="absolute bottom-4 right-4 left-4">
//                 <h3 className="text-xl font-bold text-white mb-2">{idea.name}</h3>
//                 <p className="text-sm text-gray-200 line-clamp-2">{idea.description}</p>
//               </div>
//             </div>

//             <div className="p-4">
//               <div className="flex justify-between items-center mb-4">
//                 <div className="flex items-center gap-4 text-sm text-gray-600">
//                   <span className="flex items-center gap-1">
//                     <FiHeart className="text-red-500" />
//                     {idea.likes ?? 0}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <FiEye className="text-blue-500" />
//                     {idea.views ?? 0}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex justify-between items-center">
//                 <Button
//                   size="sm"
//                   color="primary"
//                   variant="flat"
//                   endContent={<FiArrowRight />}
//                   onClick={() => router.push(`/project-ideas-club/${idea.id}`)}>
//                   التفاصيل
//                 </Button>
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       </motion.div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Hero Section */}
//       <div className="relative bg-gradient-to-r from-primary-800 to-blue-900 py-20 px-4">
//         <div className="absolute inset-0 bg-grid-white/[0.1]" />
//         <div className="max-w-7xl mx-auto relative">
//           <div className="text-center text-white mb-12">
//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-4xl md:text-5xl font-bold mb-4">
//               اكتشف أفكار مشاريع واعدة
//             </motion.h1>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-xl text-blue-100 max-w-2xl mx-auto">
//               ابدأ رحلة ريادة الأعمال مع أفكار مبتكرة تم تحليلها ودراستها بعناية
//             </motion.p>
//           </div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="max-w-3xl mx-auto">
//             <div className="relative">
//               <Input
//                 classNames={{
//                   input: "text-lg py-6 pl-16 pr-6",
//                   inputWrapper: "bg-white shadow-lg hover:shadow-xl transition-shadow duration-300",
//                 }}
//                 placeholder="ابحث عن فكرة مشروع..."
//                 startContent={<FiSearch className="text-2xl text-gray-400" />}
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 py-12">
//         <div className="flex flex-col md:flex-row gap-4 mb-8">
//           <Select
//             label="الفئة"
//             placeholder="اختر الفئة"
//             className="max-w-xs"
//             selectedKeys={[selectedCategory]}
//             onChange={(e) => setSelectedCategory(e.target.value)}>
//             {categories.map((category) => (
//               <SelectItem key={category.value} value={category.value}>
//                 {category.label}
//               </SelectItem>
//             ))}
//           </Select>
//         </div>

//         {isPending ? (
//           <p>جاري تحميل الأفكار...</p>
//         ) : projectIdeas.length === 0 ? (
//           <p>لا توجد أفكار متاحة حالياً.</p>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//               <AnimatePresence>
//                 {projectIdeas.map((idea) => (
//                   <IdeaCard key={idea.id} idea={idea} />
//                 ))}
//               </AnimatePresence>
//             </div>

//             <UniPagination
//               paginationMeta={paginationMeta}
//               onPageChange={(page) => setCurrentPage(page)}
//               onLimitChange={(newLimit) => {
//                 setLimit(newLimit);
//                 setCurrentPage(1);
//               }}
//             />
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProjectIdeasPage;
