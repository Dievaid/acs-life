import { AnimatePresence, motion } from "framer-motion";

interface RightSlideProps {
    duration: number;
    width?: string | number
    height?: string | number
}

export const RightSlideAnimation: React.FC<React.PropsWithChildren<RightSlideProps>> 
    = ({duration, width, height, children}) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{x: -100, opacity: 0, width: width, height: height}}
                animate={{x: 0, opacity: 1, width: width, height: height}}
                transition={{duration: duration}}
                exit={{opacity: 0}}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}