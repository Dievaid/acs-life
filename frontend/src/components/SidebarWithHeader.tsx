import React, {
  ReactNode,
  useEffect,
  useContext,
  useState
} from 'react';

import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Image
} from '@chakra-ui/react';

import {
  FiHome,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
} from 'react-icons/fi';

import {
  FaTicketAlt,
  FaCalendarAlt
} from 'react-icons/fa';

import {
  BsFillPeopleFill
} from 'react-icons/bs';

import {
  GrCatalog
} from 'react-icons/gr';

import { IconType } from 'react-icons';
import { AuthContext } from './AuthProvider';
import { auth, db } from '../Firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { SetPageContext } from './Contexts';
import { useNavigate } from 'react-router-dom';

interface LinkItemProps {
  name: string;
  icon: IconType;
  callback: () => any
}

const logoUrl: string = "http://swarm.cs.pub.ro/~razvan/logos/acs-logos/acs-logo-image-only.png";

export default function SidebarWithHeader({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const setView = useContext(SetPageContext);

  const LinkItems: Array<LinkItemProps> = [
    { name: 'Home', icon: FiHome, callback: () => setView("home") },
    { name: 'Orare', icon: FaCalendarAlt, callback: () => setView("timetables") },
    { name: 'Studenți', icon: BsFillPeopleFill, callback: () => setView("students") },
    { name: 'Tichete', icon: FaTicketAlt, callback: () => setView("tickets") },
    { name: 'Catalog', icon: GrCatalog, callback: () => setView('catalog') },
  ];

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image boxSize='60px' src={logoUrl} alt="logo"/>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} onClick={link.callback}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: string | number;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    // @ts-ignore
    <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const [userName, setUserName] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("");
  const authData = useContext(AuthContext);
  const setView = useContext(SetPageContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (authData?.email) {
      const queryUserData = query(collection(db, "secretari"),
      where("email", "==", authData.email))

      getDocs(queryUserData)
        .then(docs => docs.forEach(doc => {
          setUserName(`${doc.data().name} ${doc.data().surname}`);
          setImgUrl(doc.data().img);
        }))
        .catch(err => console.error(err));
    }
  }, [authData])

  return (
    <Flex
      // @ts-ignore]
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Image 
        boxSize='60px' 
        display={{ base: 'flex', md: 'none' }}
        src={logoUrl} alt="logo"
      />
      

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                  src={imgUrl}
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">{userName}</Text>
                  <Text fontSize="xs" color="gray.600">
                    Secretar
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <MenuItem
                onClick={() => setView('settings')}>
                Profil
              </MenuItem>
              <MenuDivider />
              <MenuItem
                onClick={() => {
                  signOut(auth);
                  navigate("/");
                }}
              >
                Deconectează-te
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
