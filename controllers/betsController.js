// In-memory storage for bets (replace with database later)
let bets = [
  {
    id: 1,
    title: "Who will win Uganda election?",
    options: [
      { name: "Yoweri Museveni", yesPercent: 78, noPercent: 22, yesVotes: 780, noVotes: 220, image: "https://i.pravatar.cc/150?img=12" },
      { name: "Bobi Wine", yesPercent: 22, noPercent: 78, yesVotes: 220, noVotes: 780, image: "https://i.pravatar.cc/150?img=33" }
    ],
    comments: 45,
    volume: "$2.3M",
    status: "active"
  },
  {
    id: 2,
    title: "Who releases more models in 2026?",
    options: [
      { name: "Google", yesPercent: 65, noPercent: 35, yesVotes: 650, noVotes: 350, image: "https://logo.clearbit.com/google.com" },
      { name: "xAI", yesPercent: 35, noPercent: 65, yesVotes: 350, noVotes: 650, image: "https://logo.clearbit.com/x.ai" }
    ],
    comments: 32,
    volume: "$1.8M",
    status: "active"
  },
  {
    id: 3,
    title: "Will Rwanda host AFCON 2027?",
    options: [
      { name: "Yes", yesPercent: 68, noPercent: 32, yesVotes: 680, noVotes: 320 }
    ],
    comments: 28,
    volume: "$950K",
    status: "active"
  },
  {
    id: 4,
    title: "Bitcoin hits $100K in 2024?",
    options: [
      { name: "Yes", yesPercent: 45, noPercent: 55, yesVotes: 450, noVotes: 550 }
    ],
    comments: 67,
    volume: "$5.2M",
    status: "active"
  },
  {
    id: 5,
    title: "APR FC wins league 2024?",
    options: [
      { name: "Yes", yesPercent: 78, noPercent: 22, yesVotes: 780, noVotes: 220 }
    ],
    comments: 19,
    volume: "$420K",
    status: "active"
  }
];

export const getBets = (req, res) => {
  try {
    res.json({ bets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBetById = (req, res) => {
  try {
    const bet = bets.find(b => b.id === parseInt(req.params.id));
    if (!bet) {
      return res.status(404).json({ error: 'Bet not found' });
    }
    res.json(bet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBet = (req, res) => {
  try {
    const newBet = {
      id: bets.length + 1,
      ...req.body,
      comments: 0,
      status: "active"
    };
    bets.push(newBet);
    res.status(201).json(newBet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const voteBet = (req, res) => {
  try {
    const { id } = req.params;
    const { optionName, vote } = req.body;
    
    const bet = bets.find(b => b.id === parseInt(id));
    if (!bet) {
      return res.status(404).json({ error: 'Bet not found' });
    }

    const option = bet.options.find(o => o.name === optionName);
    if (!option) {
      return res.status(404).json({ error: 'Option not found' });
    }

    if (vote === 'yes') {
      option.yesVotes += 1;
    } else {
      option.noVotes += 1;
    }

    const totalVotes = option.yesVotes + option.noVotes;
    option.yesPercent = Math.round((option.yesVotes / totalVotes) * 100);
    option.noPercent = Math.round((option.noVotes / totalVotes) * 100);

    res.json(bet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBet = (req, res) => {
  try {
    const index = bets.findIndex(b => b.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Bet not found' });
    }
    bets.splice(index, 1);
    res.json({ message: 'Bet deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
