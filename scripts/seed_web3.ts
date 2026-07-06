import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedWeb3() {
  console.log('Adding Web3/NFT skills...')
  
  // Add Web3 skills
  const skills = [
    { name: 'Solidity', category: 'Backend', icon_name: 'Code', sort_order: 10 },
    { name: 'Smart Contracts', category: 'Backend', icon_name: 'FileCode', sort_order: 11 },
    { name: 'Ethers.js', category: 'Frontend', icon_name: 'Code2', sort_order: 12 },
    { name: 'Web3.js', category: 'Frontend', icon_name: 'Globe', sort_order: 13 },
    { name: 'Hardhat / Foundry', category: 'Tools', icon_name: 'Wrench', sort_order: 14 }
  ]
  
  for (const skill of skills) {
    await supabase.from('skills').upsert(skill, { onConflict: 'name' })
  }

  console.log('Adding Web3/NFT projects...')
  
  const projects = [
    {
      title: 'NFT Marketplace',
      slug: 'nft-marketplace',
      description: 'A decentralized marketplace for minting, buying, and selling NFTs with smart contracts.',
      content: 'Built a full-stack NFT marketplace allowing users to mint ERC-721 tokens and trade them. Integrated with IPFS for metadata storage and used Solidity for the smart contracts.',
      image_url: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=800&auto=format&fit=crop',
      github_url: 'https://github.com',
      live_url: 'https://ethereum.org',
      tags: ['Solidity', 'Next.js', 'Ethers.js', 'IPFS'],
      is_published: true,
      sort_order: 1
    },
    {
      title: 'DeFi Staking Platform',
      slug: 'defi-staking',
      description: 'A Web3 DApp for staking ERC-20 tokens to earn yield.',
      content: 'Developed a decentralized finance (DeFi) application where users can stake their crypto assets into a liquidity pool and earn rewards over time.',
      image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop',
      github_url: 'https://github.com',
      live_url: 'https://ethereum.org',
      tags: ['Smart Contracts', 'React', 'Hardhat', 'Web3'],
      is_published: true,
      sort_order: 2
    }
  ]
  
  for (const project of projects) {
    await supabase.from('projects').upsert(project, { onConflict: 'slug' })
  }
  
  console.log('Adding Web3 Experience...')
  
  const experience = [
    {
      role: 'Web3 / Blockchain Developer',
      company: 'Freelance & Open Source',
      start_date: '2022-01-01',
      description: 'Developing smart contracts and decentralized applications (DApps).',
      achievements: [
        'Developed secure ERC-20 and ERC-721 smart contracts.',
        'Integrated frontend React applications with Ethereum using Ethers.js.',
        'Audited smart contracts for vulnerabilities like reentrancy.'
      ],
      is_published: true,
      sort_order: 1
    }
  ]
  
  for (const exp of experience) {
    await supabase.from('experience').insert(exp)
  }
  
  console.log('Done seeding Web3 data!')
}

seedWeb3().catch(console.error)
