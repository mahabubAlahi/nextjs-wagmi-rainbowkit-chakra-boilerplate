import { Image, Flex, Button, HStack, chakra } from "@chakra-ui/react";
//import Logo from "../public/logo.svg";
import { Link } from "react-scroll";
import data from "../data/header.data";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <chakra.header id="header">
      <Flex w="100%" px="20" py="5" align="center" justify="space-between">
        {/* <Image src={Logo.src} h="50px" /> */}

        <HStack as="nav" spacing="5">
          {/* {data.map((item, i) => (
            <Link key={i}>
              <Button variant="nav"> {item.label} </Button>
            </Link>
          ))} */}

          <Image boxSize="50px" src="abstract.png" alt="Dan Abramov" />
        </HStack>

        <HStack>
          <ConnectButton />
        </HStack>
      </Flex>
    </chakra.header>
  );
}
