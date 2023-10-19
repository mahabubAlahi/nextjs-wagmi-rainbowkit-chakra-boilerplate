import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Input,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import Navbar from "components/Navbar";
import type { NextPage } from "next";
import Head from "next/head";
import { PhoneIcon, AddIcon, WarningIcon } from "@chakra-ui/icons";
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
  readContract,
} from "@wagmi/core";
import { useAccount, useContractEvent } from "wagmi";
import greeterABI from "../abis/Greeter.json";
import { useEffect, useState } from "react";
import { providers, Wallet, Contract, utils } from "ethers";
import { Providers } from "../config/providers";
import { ChainId } from "config/constants/chainId";
import {
  createPublicClient,
  decodeEventLog,
  http,
  parseAbiItem,
  decodeAbiParameters,
} from "viem";

const Home: NextPage = () => {
  const { address, isDisconnected } = useAccount();
  const toast = useToast();

  const [greeter, setGreeter] = useState("");
  const [greeterValue, setGreeterValue] = useState("");
  const [loading, setLoading] = useState(false);

  const greetingContractAddress =
    process.env.NEXT_PUBLIC_GREET_CONTRACT_ADDRESS;

  const handleChange = (e: any) => {
    setGreeter(e.target.value);
  };

  useContractEvent({
    address: greetingContractAddress as `0x${string}`,
    abi: greeterABI,
    eventName: "SetGreeting",
    listener(log) {
      console.log(log);
    },
  });

  const getGreetingValue = async () => {
    // const data: string = (await readContract({
    //   address: greetingContractAddress as `0x${string}`,
    //   abi: greeterABI,
    //   functionName: "greet",
    // })) as string;

    const provider = new providers.JsonRpcProvider(
      Providers.getProviderUrl(ChainId.SEPOLIA)
    );
    const signer = new Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);

    const greeterContract = new Contract(
      greetingContractAddress,
      greeterABI,
      signer
    );

    const data = await greeterContract.greet();

    setGreeterValue(data);
  };

  const setGreetingValue = async (e: any) => {
    setLoading((value) => !value);
    const greetingContractAddress =
      process.env.NEXT_PUBLIC_GREET_CONTRACT_ADDRESS;

    try {
      const { request } = await prepareWriteContract({
        abi: greeterABI,
        address: greetingContractAddress,
        functionName: "setGreeting",
        args: [greeter],
        account: address,
      });

      const { hash } = await writeContract(request);
      const transactionReceipt = await waitForTransaction({
        hash,
      });
      //console.log(transactionReceipt);

      //Event handling
      const iface = new utils.Interface(greeterABI);
      const parsed = iface.parseLog(transactionReceipt.logs[0]);
      console.log("parsed", parsed);

      //Event handling using viem

      const logs = decodeEventLog({
        abi: greeterABI,
        data: transactionReceipt.logs[0].data,
        topics: transactionReceipt.logs[0].topics,
        eventName: "SetGreeting",
      });

      type SetGreeting = {
        greeting?: string;
        setter?: string;
      };

      console.log(logs);

      const argValue: SetGreeting = logs.args;

      setLoading((value) => !value);
      //alert(`Transaction confirmed with hash ${hash}!`);

      toast({
        title: "Transaction completed.",
        description: `Transaction confirmed with hash ${hash}!`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      setLoading((value) => !value);

      toast({
        title: "Transaction failed.",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.log(error);
    }
  };

  useEffect(() => {
    getGreetingValue();
  });

  return (
    <div>
      <Head>
        <title>Dapp Boilerplate</title>
        <meta
          name="description"
          content="Next Wagmi Rainbow Chakra Boilerplate"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Flex px="20" py="5" minWidth="max-content" alignItems="center" gap="2">
        <Box p="2">
          <Heading size="md">Set Greeting Value</Heading>
          <Input
            focusBorderColor="#2980b9"
            mt={5}
            color="#8e44ad"
            id="greeter"
            name="greeter"
            variant="outline"
            onChange={handleChange}
          />
          <Button
            leftIcon={<AddIcon />}
            mt={5}
            colorScheme="blue"
            onClick={setGreetingValue}
            isDisabled={isDisconnected ? true : false}
            isLoading={loading ? true : false}
          >
            Add
          </Button>
          <Text
            fontSize="14px"
            color="tomato"
            hidden={isDisconnected ? false : true}
          >
            Please Connect your wallet first!
          </Text>
        </Box>
        <Spacer />
        <Box p="2">
          <Heading size="lg">Current Greeting Value: </Heading>
          <Text fontSize="lg">{greeterValue}</Text>
        </Box>
      </Flex>
    </div>
  );
};

export default Home;
