import { motion } from "framer-motion";
import { AiFillStar } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { FiTrendingUp } from "react-icons/fi";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Button } from "@nextui-org/button";
import { Project } from "@/types/project.type";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}>
      <Card className="group border-none hover:shadow-xl transition-all duration-300" shadow="sm">
        <CardHeader className="p-0">
          <div className="relative w-full overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src={project.image}
              alt={project.name}
              className="w-full h-52 object-cover brightness-[0.98]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between">
              <Chip
                startContent={<BiCategoryAlt className="text-primary-500" />}
                className="bg-white/90 backdrop-blur-sm"
                variant="flat"
                size="sm">
                {project.category}
              </Chip>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-4 py-3">
          <div className="flex justify-between items-start gap-2 mb-3">
            <h3 className="text-xl font-bold group-hover:text-primary-500 transition-colors">{project.name}</h3>
            <Chip
              startContent={<AiFillStar className="text-yellow-400" />}
              variant="flat"
              size="sm"
              className="bg-yellow-100">
              {project.rating}
            </Chip>
          </div>

          <p className="text-sm text-default-500 line-clamp-2 mb-4">{project.description}</p>

          <div className="flex items-center gap-4 mb-4">
            <Chip
              startContent={<FiTrendingUp className="text-success" />}
              variant="flat"
              size="sm"
              className="bg-success-50">
              {project.sales} مبيعات
            </Chip>
            <span className="font-semibold text-success">↑ 24% هذا الشهر</span>
          </div>

          <div className="space-y-2">
            {project.features.slice(0, 3).map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                <span className="text-sm text-default-600">{feature}</span>
              </motion.div>
            ))}
          </div>
        </CardBody>

        <CardFooter className="justify-between px-4 pt-0">
          <div className="flex flex-col">
            <span className="text-xs text-default-500">السعر يبدأ من</span>
            <span className="font-bold text-xl text-primary">{project.price.toLocaleString()} ريال</span>
          </div>
          <Link href={`/feasibility-studies/${project.id}`} passHref>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white text-primary-800 font-bold py-2 px-4 rounded-full shadow-lg">
              عرض التفاصيل
            </motion.button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;
