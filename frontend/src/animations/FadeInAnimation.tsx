import { motion } from "framer-motion";

interface FadeInProps {
    duration: number;
}

export const FadeInAnimation: React.FC<React.PropsWithChildren<FadeInProps>>
    = ({duration, children}) => {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: duration, ease: "easeIn"}}
        >
            {children}
        </motion.div>
    );
} 