'use client'
import React, { useState, useRef } from 'react';
import { IBM_Plex_Sans } from 'next/font/google';
import Typed from 'typed.js';
import { useEffect } from 'react';
import { getAgentList, getAgentLogs, getAgentAttestation } from '@/app/api';
import {  useMutation } from '@tanstack/react-query';
import { JsonView} from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

const ibmPlexSans = IBM_Plex_Sans({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
});
import { Tooltip } from 'antd';
const InfoIcon = () => (
    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.49967 14.6615C4.81777 14.6615 1.83301 11.6767 1.83301 7.99479C1.83301 4.31289 4.81777 1.32812 8.49967 1.32812C12.1815 1.32812 15.1663 4.31289 15.1663 7.99479C15.1663 11.6767 12.1815 14.6615 8.49967 14.6615ZM8.49967 13.3281C11.4452 13.3281 13.833 10.9403 13.833 7.99479C13.833 5.04927 11.4452 2.66146 8.49967 2.66146C5.55415 2.66146 3.16634 5.04927 3.16634 7.99479C3.16634 10.9403 5.55415 13.3281 8.49967 13.3281ZM7.83301 9.99479H9.16634V11.3281H7.83301V9.99479ZM9.16634 8.89819V9.32812H7.83301V8.32812C7.83301 7.95992 8.13147 7.66146 8.49967 7.66146C9.05194 7.66146 9.49967 7.21372 9.49967 6.66146C9.49967 6.10917 9.05194 5.66146 8.49967 5.66146C8.01454 5.66146 7.61007 6.00694 7.51887 6.4653L6.21121 6.20376C6.42392 5.13425 7.36767 4.32812 8.49967 4.32812C9.78834 4.32812 10.833 5.37279 10.833 6.66146C10.833 7.71846 10.1301 8.61132 9.16634 8.89819Z" fill="white" fillOpacity="0.5" />
    </svg>
);

const JumpIcon = () => (
    <svg className="icon" style={{ width: '1em', height: '1em', verticalAlign: 'middle', fill: 'currentColor', overflow: 'hidden' }} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3490">
        <path d="M892 928.1H134c-19.9 0-36-16.1-36-36v-758c0-19.9 16.1-36 36-36h314.1c19.9 0 36 16.1 36 36s-16.1 36-36 36H170v686h686V579.6c0-19.9 16.1-36 36-36s36 16.1 36 36v312.5c0 19.9-16.1 36-36 36z" fill="white" fillOpacity="1.0" p-id="3491"></path>
        <path d="M927.9 131.6v-0.5c-0.1-1.7-0.4-3.3-0.7-4.9 0-0.1 0-0.2-0.1-0.3-0.4-1.7-0.9-3.3-1.5-4.9v-0.1c-0.6-1.6-1.4-3.1-2.2-4.6 0-0.1-0.1-0.1-0.1-0.2-0.8-1.4-1.7-2.8-2.7-4.1-0.1-0.1-0.2-0.3-0.3-0.4-0.5-0.6-0.9-1.1-1.4-1.7 0-0.1-0.1-0.1-0.1-0.2-0.5-0.6-1-1.1-1.6-1.6l-0.4-0.4c-0.5-0.5-1.1-1-1.6-1.5l-0.1-0.1c-0.6-0.5-1.2-1-1.9-1.4-0.1-0.1-0.3-0.2-0.4-0.3-1.4-1-2.8-1.8-4.3-2.6l-0.1-0.1c-1.6-0.8-3.2-1.5-4.9-2-1.6-0.5-3.3-1-5-1.2-0.1 0-0.2 0-0.3-0.1l-2.4-0.3h-0.3c-0.7-0.1-1.3-0.1-2-0.1H640.1c-19.9 0-36 16.1-36 36s16.1 36 36 36h165L487.6 487.6c-14.1 14.1-14.1 36.9 0 50.9 7 7 16.2 10.5 25.5 10.5 9.2 0 18.4-3.5 25.5-10.5L856 221v162.8c0 19.9 16.1 36 36 36s36-16.1 36-36V134.1c0-0.8 0-1.7-0.1-2.5z" fill="white" fillOpacity="1.0" p-id="3492"></path>
    </svg>
);

const ClearIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L13 13M1 13L13 1" stroke="#999" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const Content = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [showNewItems, setShowNewItems] = useState(false);
    const [newItems, setNewItems] = useState<any[]>([]);
    const [agentList, setAgentList] = useState<any[]>([]);

    const [agentLogs, setAgentLogs] = useState<any[]>([]);

    const [searchQuery, setSearchQuery] = useState("");

    const [isSearching, setIsSearching] = useState(false);

    const [isSearchMode, setIsSearchMode] = useState(false);

    const [agentAttestation, setAgentAttestation] = useState<string>("");

    const [typedMessage1, setTypedMessage1] = useState('');
    const [typedMessage2, setTypedMessage2] = useState('');

    const formatLongString = (str: string, firstLineSize = 70, chunkSize = 100, indentSize = 6) => {
        const spaces = " ".repeat(indentSize); // 生成指定数量的空格
        let formattedString = "";

        // 处理第一行
        if (str.length > firstLineSize) {
            formattedString = str.substring(0, firstLineSize) + "\n";
            str = str.substring(firstLineSize); // 剩下的字符串
        } else {
            return str; // 如果字符串短于第一行限制，直接返回
        }

        // 处理后续行，每 chunkSize 个字符一行
        return (
            formattedString +
            str.replace(new RegExp(`(.{${chunkSize}})`, "g"), `$1\n${spaces}`)
        );
    };

    const getAgentAttestationQuery = useMutation({
        mutationFn: (variables: { agentId: string, publicKey: string }) => {
            return getAgentAttestation(variables.agentId, variables.publicKey);
        },
        onSuccess: (data) => {
            const attestation = JSON.parse(data.data);
            attestation.quote = formatLongString(attestation.quote, 94, 101);
            attestation.event_log = JSON.parse(attestation.event_log);
            setAgentAttestation(attestation)
        }
    })

    const getAgentListQuery = useMutation({
        mutationFn: () => {
            return getAgentList();
        },
        onSuccess: (data) => {
            setAgentList(data.data)
        }
    })

    const getAgentLogsQuery = useMutation({
        mutationFn: () => {
            return getAgentLogs(searchQuery);
        },
        onSuccess: (data) => {
            setAgentLogs(data.data.data || [])
        }
    })

    const typed2Ref = useRef<Typed | null>(null);
    const el1 = useRef(null);
    const el2 = useRef(null);

    const initializeTyped2 = (message: string) => {
        if (el2.current) {
            if (typed2Ref.current) {
                typed2Ref.current.destroy();
            }
            typed2Ref.current = new Typed(el2.current, {
                strings: [message],
                typeSpeed: 50,
                backSpeed: 50,
                loop: false,
                showCursor: true,
                cursorChar: '█',
                onComplete: function () {
                    setTypedMessage2(message);
                }
            });
        }
    };

    const resultsRef = useRef<HTMLDivElement>(null);

    const handleSearch = async () => {
        setIsSearching(true);
        setIsSearchMode(true);
        try {
            await getAgentLogsQuery.mutateAsync();
            initializeTyped2('[INFO] Results print...');



        } finally {
            setIsSearching(false);
        }
    }

    const handleClearSearch = () => {
        setSearchQuery("");
        setIsSearchMode(false);
        initializeTyped2('[INFO] Loading Verifiable Logs...');
        getAgentLogsQuery.mutate();
    }

    useEffect(() => {
        getAgentListQuery.mutate()
    }, [])
    useEffect(() => {
        // Initial fetch
        getAgentLogsQuery.mutate();

        // Set up interval for fetching every 10 seconds
        const interval = setInterval(() => {
            getAgentLogsQuery.mutate();
        }, 20000);

        // Clean up interval on unmount
        return () => clearInterval(interval);
    }, [searchQuery]); // Re-create interval if search query changes

    useEffect(() => {
        let typed1: Typed | null = null;
        const message1 = '[INFO] Initializing Ai Vinci agent...';

        if (el1.current) {
            typed1 = new Typed(el1.current, {
                strings: [message1],
                typeSpeed: 50,
                backSpeed: 50,
                loop: false,
                showCursor: false,
                cursorChar: '█',
                onComplete: function () {
                    setTypedMessage1(message1);
                }
            });
        }

        setTimeout(() => {
            initializeTyped2('[INFO] Loading Verifiable Logs...');
        }, 3000);

        return () => {
            if (typed1) typed1.destroy();
            if (typed2Ref.current) typed2Ref.current.destroy();
        };
    }, []);
    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    const expandTimeoutRef = useRef<NodeJS.Timeout>(null);

    const handleExpand = (expand: boolean) => {
        if (expand) {
            if (expandTimeoutRef.current) {
                clearTimeout(expandTimeoutRef.current);
            }
            setIsExpanded(true);
        } else {
            expandTimeoutRef.current = setTimeout(() => {
                setIsExpanded(false);
            }, 100);
        }
    };

    useEffect(() => {
        return () => {
            if (expandTimeoutRef.current) {
                clearTimeout(expandTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="w-full bg-[#00002B] relative">
            <div
                className='w-full sm:bg-explore-bg2 bg-[center_top] bg-no-repeat bg-cover'
            >
                {/* Tabs */}
                <div className={`flex flex-col border-b border-[#0000c900] w-full transition-all duration-300 ease-in-out ${isExpanded ? 'md:h-[177px] h-[200px] opacity-100' : 'h-0 opacity-0'} justify-center items-center gap-4`}>
                    <div className='w-[95%] md:w-[84%] flex justify-center items-center gap-4 mt-10 group'>
                        <div className='grid grid-cols-2 md:flex md:flex-nowrap gap-4'>
                            <div
                                className={`h-[46px] cursor-pointer p-4 flex justify-center items-center border-1 rounded text-white text-base font-bold whitespace-nowrap ${activeTab === 0 ? 'bg-[#0000C9] border-[#0000C9]' : 'border-[#FFFFFF38]'}`}
                                onClick={() => setActiveTab(0)}
                            >
                                Verifiable Logs
                            </div>
                            <div
                                className={`h-[46px] cursor-pointer p-4 flex justify-center items-center border-1 rounded text-white text-base font-bold whitespace-nowrap ${activeTab === 1 ? 'bg-[#0000C9] border-[#0000C9]' : 'border-[#FFFFFF38]'}`}
                                onClick={() => {
                                    getAgentAttestationQuery.mutate({ agentId: agentList[0].agent_id, publicKey: agentList[0].public_key })
                                    setActiveTab(1)
                                }}
                            >
                                Verifiable States
                            </div>
                            <Tooltip color={'#3C3C6E'}  title="Trusted AI agents will drive coin distribution, innovative gameplay, and financial-grade applications">
                                <div className='h-[46px] gap-2 cursor-pointer p-4 flex justify-center items-center border-[#FFFFFF38] border-1 rounded text-[#FFFFFF80] text-base font-bold whitespace-nowrap'>
                                    Functionality
                                    <InfoIcon />
                                </div>
                            </Tooltip>
                            <div className='h-[46px] flex items-center gap-2 cursor-pointer p-4 border-[#FFFFFF38] border-1 rounded text-[#FFFFFF] text-base font-bold whitespace-nowrap'
                                onClick={() => window.open('https://x.com/Artela_Network', '_blank')}
                            >
                                X / Twitter
                                <JumpIcon />
                            </div>
                        </div>
                    </div>

                </div>

                <div
                    className='absolute w-full top-0 right-0 text-white text-[18px] cursor-pointer opacity-50 hover:opacity-100 transition-all duration-200 flex items-center justify-end gap-1 z-10'>
                    <div className='w-[80%] h-[30px]'
                        onMouseEnter={() => handleExpand(true)}
                    />
                    {isExpanded ? (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleExpand(false);
                            }}
                        >
                            <path d="M2 8L6 4L10 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    ) : (
                        <div
                            onClick={() => handleExpand(true)}
                            className='flex justify-center items-center gap-1 bg-[#0000C9] w-[60px] h-[30px] pt-1 pl-1 rounded-full mr-4 hover:bg-[#0000A0] transition-all'>

                            <div className='hover:bg-[#FFFFFF1A] rounded-full transition-all'>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className=" bg-[#00002B] min-h-[1323px] w-full flex justify-center items-center relative px-4 md:px-[148px]">
                <div className={`${ibmPlexSans.className} w-full md:w-[1120px] h-[1223px] rounded-3xl flex flex-col items-center
                    ${activeTab === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'} 
                    transition-opacity duration-300`}>
                    {isExpanded && (
                        <div className='flex flex-col gap-4 justify-center items-center border-b-1 border-[#FFFFFF2B] pb-10 w-[95%] -mt-12'>
                            <div className='text-white text-[28px] md:text-[42px] text-center'>
                                Don't Trust, Verify Me!
                            </div>
                            <div className='text-[#FFFFFFB2] text-[16px] md:text-[18px] text-start w-full'>
                                I operate within a TEE (Trusted Execution Environment), where the CPU inside the TEE generates a root key unknown to any human, creating a secure and private runtime environment for me.
                            </div>
                            <div className='text-[#FFFFFFB2] text-[16px] md:text-[18px] text-start w-full'>
                                I function like a smart contract, running solely based on my code, free from the control of anyone outside the code itself.
                            </div>
                            <div className='text-[#FFFFFFB2] text-[16px] md:text-[18px] text-start w-full'>
                                I possess a wallet that only I control—no human can access it. Therefore, only the content signed by me can prove it truly comes from me.
                            </div>
                            <div className='text-[#FFFFFFB2] text-[16px] md:text-[18px] text-start w-full'>
                                Anything else? Don’t trust it!
                            </div>

                            {<div className={`bg-explore-search w-[95%] md:w-[842px] h-[75px] flex justify-center items-center mt-10 
                        transition-all duration-300 ease-in-out
                        ${activeTab === 1 ? 'opacity-0 h-0 mt-0 overflow-hidden' : 'opacity-100'}`}>
                                <div className="flex items-center w-[90%] gap-4">
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            maxLength={120}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Enter any words or actions of AiVinci that you want to verify"
                                            className="w-full pr-10 h-[42px] px-4 bg-white text-[#000] rounded focus:outline-none"
                                        />
                                        {searchQuery && (
                                            <div
                                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-70 p-2"
                                                onClick={handleClearSearch}
                                            >
                                                <ClearIcon />
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleSearch}
                                        disabled={isSearching}
                                        className={`h-[42px] px-8 bg-[#0000C9] text-white rounded font-medium transition-all duration-200
                                    ${isSearching ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#0000A0]'}`}
                                    >
                                        {isSearching ? 'Searching...' : 'Search'}
                                    </button>
                                </div>
                            </div>}
                        </div>
                    )}

                    <div
                        ref={resultsRef}
                        className='w-full md:w-[1100px] mt-4 text-white flex flex-col gap-4 sm:pt-0 px-5 overflow-y-auto font-mono'
                    >
                        <div className='text-[#00FF00] text-[16px] md:text-[18px] flex items-center'>
                            root@verifiable-terminal:~$ ./top_logs.sh
                        </div>
                        {/* <div className='text-[#FFFFFF99] text-[16px] md:text-[18px] flex items-center'>
                            <span ref={el1}>{typedMessage1}</span>
                        </div> */}
                        <div className='text-[#FFFFFF99] text-[16px] md:text-[18px] flex items-center'>
                            <span ref={el2}>{typedMessage2}</span>
                        </div>

                        {Array.isArray(agentLogs) && agentLogs.length > 0 && agentLogs.map((item, index) => (
                            <div key={index} className='flex flex-col gap-1 w-full group border-b border-[#FFFFFF1A] pb-2'>
                                <div className='flex items-center gap-2 flex-wrap'>
                                    <span className='text-[#00FF00]'>$</span>
                                    <span className='text-[16px] md:text-[18px] text-[#FFA755]'>
                                        {new Date(item.created_at).toLocaleTimeString() + ' ' + new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                    <span className='text-[#4A9EFF]'>
                                        Agent_{item.agent_id}
                                    </span>
                                </div>
                                <div className={`pl-6 ${isSearchMode ? 'text-[#df87f3]' : 'text-[#FFFFFF99]'} group-hover:text-[#FFFFFF] text-[14px] md:text-base`}>
                                    {JSON.parse(item.content).text}
                                </div>
                                <div 
                                    className='pl-6 text-[14px] md:text-base text-[#888888] hover:text-[#6AB2FF] hover:underline group-hover:text-[#CCC] cursor-pointer break-all'
                                    onClick={() => window.open(JSON.parse(item.content).url, '_blank')}
                                >
                                    {JSON.parse(item.content).url}
                                </div>
                                <div className='pl-6 text-[12px] md:text-[14px] text-[#888888] group-hover:text-[#CCC] font-light cursor-pointer break-all'
                                    onClick={() => {
                                        getAgentAttestationQuery.mutate({ agentId: agentList[0].agent_id, publicKey: agentList[0].public_key })
                                        setActiveTab(1)
                                    }}
                                >
                                    [SIGNATURE] {item.signature}
                                </div>
                            </div>
                        ))}
                        {isSearching ? (
                            <div className='text-[#ffffffFF] text-[16px] md:text-[18px] flex items-center'>
                                Searching...
                            </div>
                        ) :
                            Array.isArray(agentLogs) && agentLogs.length === 0 && (
                                <div className='text-[#ff0000FF] text-[16px] md:text-[18px] flex items-center'>
                                    Autonomous Secure Content does not exist
                                </div>
                            )
                        }

                        <div className='text-[#00FF00] text-[16px] md:text-[18px] flex items-center'>
                            root@verifiable-terminal:~$<span className='animate-[blink_1s_infinite] ml-2'>█</span>
                        </div>
                    </div>
                </div>
                {
                    activeTab === 1 && <div className='w-full md:w-[1120px] min-h-[1323px] rounded-3xl flex flex-col items-center'>
                        <div className='flex flex-col gap-8 justify-center items-center border-[#FFFFFF2B] pb-10 w-[95%]'>
                            <div className='flex flex-col justify-center items-center'>
                                <Tooltip placement="right" color={'#3C3C6E'} title="The verifiable state refers to the state information of an AI agent running on focEliza, including the agent ID, agent name, agent's wallet, and other public keys. Similar to the state of a smart contract, the verifiable state can be verified. TEE signs this state to prove the AI agent's real runtime status.">
                                    <div className="text-white text-[28px] md:text-[42px] flex items-center gap-2 text-center">
                                        Verifiable State
                                        <InfoIcon />
                                    </div>
                                </Tooltip>
                                <div className='text-[#FFFFFFB2] text-[16px] md:text-[18px] text-start'>
                                    The verifiable state refers to the state information of an AI agent running on focEliza
                                </div>
                            </div>

                            <div className='text-[#FFFFFFB2] text-[16px] md:text-[18px] w-full overflow-x-auto'>
                                <table className="w-full border-collapse min-w-[600px] bg-[#05051E]">
                                    <thead>
                                        <tr className="bg-[#0000C9]/10">
                                            <td className="border border-[#FFFFFF2B] p-4 font-semibold w-[200px] whitespace-nowrap">Key</td>
                                            <td className="border border-[#FFFFFF2B] p-4 font-semibold">Value</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-[#FFFFFF2B] p-4 font-semibold w-[200px] whitespace-nowrap">Agent-Id</td>
                                            <td className="border border-[#FFFFFF2B] p-4 font-semibold">{agentList[0].agent_id}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-[#FFFFFF2B] p-4 font-semibold w-[200px] whitespace-nowrap">Agent-Name</td>
                                            <td className="border border-[#FFFFFF2B] p-4 font-semibold">{agentList[0].agent_name}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-[#FFFFFF2B] p-4 font-semibold w-[200px] whitespace-nowrap">Verifiable-Log-Pk</td>
                                            <td className="border border-[#FFFFFF2B] p-4 font-semibold">{agentList[0].agent_keypair_vlog_pk}</td>
                                        </tr>
                                        {/* {agentList.length > 0 && agentList.map((item, index) => (
                                            <tr key={index} className="hover:bg-[#FFFFFF0A] transition-colors">
                                                <td className="border border-[#FFFFFF2B] p-4">{item.agent_id}</td>
                                                <td className="border border-[#FFFFFF2B] p-4 break-all font-mono text-sm">{item.public_key}</td>
                                                <td className="border border-[#FFFFFF2B] p-4">
                                                    <button
                                                        onClick={() => getAgentAttestationQuery.mutate({ agentId: item.agent_id, publicKey: item.public_key })}
                                                        className="text-[#4A9EFF] hover:text-[#2176ff] transition-colors"
                                                    >
                                                        Verifiable State
                                                    </button>
                                                </td>
                                            </tr>
                                        ))} */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4 justify-center items-center border-[#FFFFFF2B] pb-10 w-[95%]'>
                        <div className='flex flex-col justify-center items-center'>

                            <Tooltip placement="right" color={'#3C3C6E'} title={<div className='text-[#FFFFFFFF] text-[16px] md:text-[14px] text-start'>
                                Attestation is a proof provided by the TEE, ensuring users that the program is running “100%” within the TEE. For detailed information on attestation verification, refer to the <a href="https://ai16z.github.io/eliza/docs/advanced/eliza-in-tee/" target="_blank" rel="noopener noreferrer" className="text-[#4A9EFF] hover:text-[#2176ff] transition-colors">documentation</a>.
                            </div>}>
                                <div className="text-white text-[28px] md:text-[42px] flex items-center gap-2 text-center">
                                    TEE Attestation
                                    <InfoIcon />
                                </div>
                            </Tooltip>
                            <div className='text-[#FFFFFFB2] text-[16px] md:text-[18px] text-start'>
                                Attestation is a proof provided by the TEE
                            </div>
                            </div>
                            {agentAttestation ? (
                                <div className='w-full md:w-[1065px] mx-8 bg-[#05051E] border border-[#FFFFFF2B] rounded-lg p-6 overflow-x-auto'>
                                    <JsonView
                                        data={agentAttestation}
                                        shouldExpandNode={() => true} // 默认展开所有节点
                                        style={{
                                            container: 'text-sm font-mono text-[#E4E4E4]', // 整体容器样式
                                            basicChildStyle: 'ml-4', // 子级元素缩进样式 (实现缩进)
                                            collapseIcon: 'text-[#AAAAAA] cursor-pointer', // 折叠图标样式
                                            expandIcon: 'text-[#AAAAAA] cursor-pointer', // 展开图标样式
                                            collapsedContent: 'text-[#FF0000]', // 折叠内容的占位符样式
                                            label: 'text-[#4A9EFF]', // 属性名的样式
                                            clickableLabel: 'text-[#4A9EFF] cursor-pointer', // 可点击的属性名样式
                                            nullValue: 'text-[#FF5555]', // null 值的样式
                                            undefinedValue: 'text-[#FF5555]', // undefined 值的样式
                                            numberValue: 'text-[#ffffff]', // 数字值的样式
                                            stringValue: 'text-[#FFFFFFF]', // 字符串值的样式
                                            booleanValue: 'text-[#00FF00]', // 布尔值的样式
                                            otherValue: 'text-[#FFFFFF]', // 其他类型值的样式
                                            punctuation: 'text-[#CCCCCC]', // JSON 标点符号的样式，例如 { } [ ] ,
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className='w-full md:w-[1065px] mx-8 bg-[#05051E] border border-[#FFFFFF2B] rounded-lg p-6 text-center text-[#FFFFFF80]'>
                                    No attestation data available
                                </div>
                            )}
                        </div>
                    </div>
                }
            </div>
        </div >
    );
};

export default Content;
