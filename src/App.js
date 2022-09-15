import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import './App.css';
import abi from "./utils/WavePortal.json";
import {ColorModeSwitcher} from './ColorModeSwitcher';
import {
    Box,
    Button,
    ChakraProvider, Grid,
    GridItem,
    Input,
    InputGroup,
    InputRightElement,
    Stack, Text,
    Textarea,
    theme, VStack
} from '@chakra-ui/react'

export default function App() {

    const [currentAccount, setCurrentAccount] = useState("");
    /*
    * All state property to store all waves
     */
    const [allWaves, setAllWaves] = useState([]);
    /**
     * Create a variable here that holds the contract address after you deploy!
     */
    const contractAddress = "0x3C8BAb4F83B15631Df823583Cf11089f16Be8D1C";
    /**
     * Create a variable here that references the abi content!
     */
    const contractABI = abi.abi;

    const [inputValue, setInputValue] = useState('')

    const handleInputChange = (event) => setInputValue(event.target.value);

    const checkIfWalletIsConnected = async () => {
        try {
            const {ethereum} = window;

            if (!ethereum) {
                console.log("Make sure you have metamask!");
                return;
            } else {
                console.log("We have the ethereum object", ethereum);
            }

            const accounts = await ethereum.request({method: "eth_accounts"});

            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log("Found an authorized account:", account);
                setCurrentAccount(account);
            } else {
                console.log("No authorized account found")
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Implement your connectWallet method here
     */
    const connectWallet = async () => {
        try {
            const {ethereum} = window;

            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }

            const accounts = await ethereum.request({method: "eth_requestAccounts"});

            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error)
        }
    }

    const wave = async () => {
        try {
            const {ethereum} = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

                let count = await wavePortalContract.getTotalWaves();
                console.log("Retrieved total wave count...", count.toNumber());

                /*
                * Execute the actual wave from your smart contract
                */
                const waveTxn = await wavePortalContract.wave(inputValue,{ gasLimit: 300000 });
                console.log("Mining...", waveTxn.hash);

                await waveTxn.wait();
                console.log("Mined -- ", waveTxn.hash);

                count = await wavePortalContract.getTotalWaves();
                console.log("Retrieved total wave count...", count.toNumber());
                await getAllWaves();
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    }
    /*
     * Create a method that gets all waves from your contract
     */
    const getAllWaves = async () => {
        try {
            const {ethereum} = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

                /*
                 * Call the getAllWaves method from your Smart Contract
                 */
                const waves = await wavePortalContract.getAllWaves();


                /*
                 * We only need address, timestamp, and message in our UI so let's
                 * pick those out
                 */
                let wavesCleaned = [];
                waves.forEach(wave => {
                    wavesCleaned.push({
                        address: wave.waver,
                        timestamp: new Date(wave.timestamp * 1000),
                        message: wave.message
                    });
                });

                /*
                 * Store our data in React State
                 */
                setAllWaves(wavesCleaned);
            } else {
                console.log("Ethereum object doesn't exist!")
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        getAllWaves();
    }, [])


    return (
        <ChakraProvider theme={theme}>
            <Box textAlign="center" fontSize="xl">
                <Grid minH="100vh" p={3}>
                    <ColorModeSwitcher justifySelf="flex-end"/>
                    <VStack spacing={8}>
                        <Box>
                            👋 Hey there!
                        </Box>

                        <Box>
                            I am thanasisxan, I work as fullstack dev and I am trying to learn more about blockchain
                            development!
                            <Box>
                                Connect your Ethereum wallet and wave at me!
                            </Box>
                        </Box>
                        {currentAccount && (
                            <Box>
                                {/*<Stack direction='row' spacing={3}>*/}
                                <Textarea size='lg' value={inputValue}
                                          onChange={handleInputChange}
                                          placeholder='Write a message to goerli testnet blockchain!'/>

                                <Button className="waveButton" colorScheme='teal' size='md' onClick={wave}>
                                    Send
                                </Button>
                                {/*</Stack>*/}
                            </Box>
                        )}

                        {/*
                * If there is no currentAccount render this button
                */}
                        {!currentAccount && (
                            <Button className="waveButton" onClick={connectWallet}>
                                Connect Wallet
                            </Button>
                        )}

                        {allWaves.map((wave, index) => {
                            return (
                                <Box key={index}
                                     style={{
                                         backgroundColor: "#45a1c9",
                                         marginTop: "16px",
                                         padding: "8px",
                                         border: "solid 2px #f1d959",
                                         "border-radius":"15px"}}>
                                    <Text>Address: {wave.address}</Text>
                                    <Text>Time: {wave.timestamp.toString()}</Text>
                                    <Text>Message: {wave.message}</Text>
                                </Box>)
                        })}
                    </VStack>
                </Grid>
            </Box>
        </ChakraProvider>
    );
}