
const { Client, Events, GatewayIntentBits, SlashCommandBuilder, Collection, REST, Routes, PermissionFlagsBits } = require('discord.js');

// Bot configuration
const config = {
  expansionCooldown: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
  adminRoleName: 'GameMaster',
  kingdoms: new Map(), // Store kingdom data
  playerData: new Map(), // Store player data
  lastExpansion: new Map(), // Track expansion cooldowns
  beasts: new Map(), // Store beast data
  statIncreaseRate: 0.05, // How much stats increase per action
  xpToLevelRatio: 100, // XP needed per level
  tupperAvatars: new Map(), // Store GM tupper avatars
  lootTables: new Map(), // Store loot tables for beasts
  craftingRecipes: new Map(), // Store crafting recipes
  gmResponses: [
    "The guard nods grimly as he hears your tale. 'Aye, these are troubled times indeed.'",
    "The innkeeper leans in, voice low. 'Strange happenings in the woods, m'lord. Best keep your sword at the ready.'",
    "A wizened old woman narrows her eyes. 'The stars speak of change. Great change coming to these lands.'",
    "The blacksmith hammers at his forge. 'Need something sturdy for these dangerous times? I've got just the thing.'",
    "The merchant's eyes light up. 'Ah, a traveler! Perhaps you'd be interested in some exotic wares from the southern kingdoms?'",
    "A hooded figure in the corner raises a cup in your direction. 'To adventure and fortune, stranger.'",
    "The village elder strokes his beard thoughtfully. 'Our people have endured much, but this... this is different.'",
    "A young squire rushes up to you. 'My lord knight sent me to find capable warriors. Are you such a one?'",
    "The bard strums a melancholy tune. 'Have you heard the tale of the fallen kingdom? Some say treasures still lie in its ruins.'",
    "The stablemaster eyes your mount. 'Fine beast you have there. Been through many battles, I'd wager.'",
    "A group of children gather around you, eyes wide. 'Tell us a story of your adventures, please!'",
    "The town crier calls out. 'Hear ye, hear ye! The Duke offers gold for any who rid his lands of the beast!'",
    "The court wizard studies you carefully. 'You have an unusual aura about you. Most interesting.'",
    "A knight in gleaming armor inclines his head. 'Well met, traveler. These roads are not safe of late.'",
    "The old farmer spits. 'Taxes, bandits, now monsters too? When will our troubles end?'",
    "The priestess blesses you with a gesture. 'May the light guide you through the coming darkness.'",
    "A ragged refugee clutches at your cloak. 'Please, have you seen my family on the road?'",

// Initialize beasts
function initializeBeasts() {
  // Common beasts
  config.beasts.set("wolf", {
    name: "Wolf",
    description: "A fierce predator with sharp teeth and a hungry gaze. Wolves often hunt in packs and are known for their cunning.",
    health: 40,
    damage: 8,
    armor: 3,
    xp: 25,
    gold: 5,
    difficulty: "easy",
    habitat: ["forest", "plains", "hills"],
    attackMessages: [
      "The wolf lunges with snapping jaws!",
      "The wolf circles around you, looking for an opening!",
      "The wolf howls, calling for its pack!"
    ]
  });
  
  config.beasts.set("bandit", {
    name: "Bandit",
    description: "A desperate outlaw armed with crude weapons and a dangerous look. Bandits prey on travelers and merchants.",
    health: 50,
    damage: 10,
    armor: 5,
    xp: 30,
    gold: 15,
    difficulty: "easy",
    habitat: ["forest", "plains", "hills", "mountains", "roads"],
    attackMessages: [
      "The bandit swings a rusty blade!",
      "The bandit takes aim with a short bow!",
      "\"Your coin or your life!\" the bandit snarls!"
    ]
  });
  
  config.beasts.set("goblin", {
    name: "Goblin",
    description: "A small, green-skinned creature with sharp teeth and a malicious grin. Goblins are known for their traps and thievery.",
    health: 30,
    damage: 6,
    armor: 2,
    xp: 20,
    gold: 10,
    difficulty: "easy",
    habitat: ["forest", "caves", "mountains"],
    attackMessages: [
      "The goblin stabs with a crude dagger!",
      "The goblin throws a small explosive!",
      "The goblin cackles maniacally as it attacks!"
    ]
  });
  
  // Uncommon beasts
  config.beasts.set("bear", {
    name: "Bear",
    description: "A massive brown bear with powerful claws and a territorial attitude. Their raw strength is not to be underestimated.",
    health: 80,
    damage: 15,
    armor: 8,
    xp: 50,
    gold: 20,
    difficulty: "medium",
    habitat: ["forest", "mountains", "hills"],
    attackMessages: [
      "The bear rises on its hind legs, towering above you!",
      "The bear swipes with enormous claws!",
      "The bear's roar shakes the very ground!"
    ]
  });
  
  config.beasts.set("troll", {
    name: "Troll",
    description: "A hulking, warty creature with regenerative abilities and immense strength. Trolls are notoriously difficult to kill.",
    health: 100,
    damage: 18,
    armor: 12,
    xp: 70,
    gold: 35,
    difficulty: "medium",
    habitat: ["mountains", "caves", "swamp"],
    attackMessages: [
      "The troll swings a massive club, shattering the ground!",
      "The troll grabs a nearby boulder and hurls it!",
      "The troll's wounds begin to heal before your eyes!"
    ]
  });
  
  config.beasts.set("wraith", {
    name: "Wraith",
    description: "A spectral being of dark energy and malice. Wraiths drain the life force of the living to sustain themselves.",
    health: 70,
    damage: 20,
    armor: 5,
    xp: 80,
    gold: 40,
    difficulty: "medium",
    habitat: ["ruins", "graveyards", "abandoned places"],
    attackMessages: [
      "The wraith passes through solid matter to strike!",
      "The wraith's touch sends chills through your very soul!",
      "The wraith wails, a sound that freezes your blood!"
    ]
  });
  
  // Rare beasts
  config.beasts.set("griffin", {
    name: "Griffin",
    description: "A majestic creature with the body of a lion and the head and wings of an eagle. Griffins are noble but ferocious when threatened.",
    health: 150,
    damage: 25,
    armor: 15,
    xp: 120,
    gold: 70,
    difficulty: "hard",
    habitat: ["mountains", "plains"],
    attackMessages: [
      "The griffin dives from above with razor-sharp talons!",
      "The griffin's beak tears through armor like parchment!",
      "The griffin beats its powerful wings, creating a windstorm!"
    ]
  });
  
  config.beasts.set("minotaur", {
    name: "Minotaur",
    description: "A terrifying hybrid with the body of a man and the head of a bull. Minotaurs are powerful and relentless adversaries.",
    health: 180,
    damage: 30,
    armor: 20,
    xp: 150,
    gold: 90,
    difficulty: "hard",
    habitat: ["ruins", "caves", "labyrinths"],
    attackMessages: [
      "The minotaur charges forward, horns lowered!",
      "The minotaur swings a massive battleaxe overhead!",
      "The minotaur stomps the ground, sending tremors through the area!"
    ]
  });
  
  // Epic beasts
  config.beasts.set("dragon", {
    name: "Dragon",
    description: "An ancient, fearsome beast with scales harder than steel, razor-sharp claws, and fiery breath. Dragons are the stuff of legend and nightmare.",
    health: 300,
    damage: 50,
    armor: 30,
    xp: 500,
    gold: 500,
    difficulty: "legendary",
    habitat: ["mountains", "caves", "ruins"],
    attackMessages: [
      "The dragon unleashes a devastating stream of fire!",
      "The dragon's tail sweeps across the battlefield like a battering ram!",
      "The dragon takes flight, its massive wings creating hurricane-force winds!"
    ]
  });
  
  config.beasts.set("kraken", {
    name: "Kraken",
    description: "A colossal sea monster with countless tentacles and a maw large enough to swallow ships whole. Few sailors live to tell tales of the kraken.",
    health: 350,
    damage: 45,
    armor: 25,
    xp: 450,
    gold: 400,
    difficulty: "legendary",
    habitat: ["ocean", "coast"],
    attackMessages: [
      "The kraken's tentacle lashes out from the depths!",
      "The kraken drags you toward its gaping maw!",
      "The kraken creates a whirlpool, threatening to pull everything under!"
    ]
  });
  
  // Initialize loot tables
  initializeLootTables();
  
  // Initialize crafting recipes
  initializeCraftingRecipes();
  
  // Initialize tupper avatars for GM
  initializeTupperAvatars();
}

// Initialize loot tables for beasts
function initializeLootTables() {
  // Common beast loot
  config.lootTables.set("wolf", [
    {item: "wolf pelt", chance: 0.7, quantity: 1},
    {item: "wolf fang", chance: 0.5, quantity: 1},
    {item: "wolf meat", chance: 0.8, quantity: "1-3"}
  ]);
  
  config.lootTables.set("bandit", [
    {item: "leather scraps", chance: 0.6, quantity: "1-3"},
    {item: "rusty dagger", chance: 0.4, quantity: 1},
    {item: "small coin pouch", chance: 0.7, quantity: 1}
  ]);
  
  config.lootTables.set("goblin", [
    {item: "crude knife", chance: 0.5, quantity: 1},
    {item: "goblin ear", chance: 0.4, quantity: "1-2"},
    {item: "shiny trinket", chance: 0.3, quantity: 1}
  ]);
  
  // Uncommon beast loot
  config.lootTables.set("bear", [
    {item: "bear pelt", chance: 0.8, quantity: 1},
    {item: "bear claw", chance: 0.6, quantity: "1-3"},
    {item: "bear meat", chance: 0.9, quantity: "2-5"}
  ]);
  
  config.lootTables.set("troll", [
    {item: "troll hide", chance: 0.7, quantity: "1-2"},
    {item: "troll tooth", chance: 0.5, quantity: "1-3"},
    {item: "troll blood", chance: 0.4, quantity: 1}
  ]);
  
  config.lootTables.set("wraith", [
    {item: "ectoplasm", chance: 0.6, quantity: "1-3"},
    {item: "soul essence", chance: 0.3, quantity: 1},
    {item: "spectral dust", chance: 0.5, quantity: "1-4"}
  ]);
  
  // Rare beast loot
  config.lootTables.set("griffin", [
    {item: "griffin feather", chance: 0.7, quantity: "2-4"},
    {item: "griffin talon", chance: 0.5, quantity: "1-2"},
    {item: "griffin eye", chance: 0.2, quantity: 1}
  ]);
  
  config.lootTables.set("minotaur", [
    {item: "minotaur horn", chance: 0.6, quantity: "1-2"},
    {item: "minotaur hide", chance: 0.7, quantity: 1},
    {item: "enchanted battleaxe", chance: 0.3, quantity: 1}
  ]);
  
  // Epic beast loot
  config.lootTables.set("dragon", [
    {item: "dragon scale", chance: 0.8, quantity: "3-8"},
    {item: "dragon tooth", chance: 0.5, quantity: "1-3"},
    {item: "dragon heart", chance: 0.1, quantity: 1},
    {item: "ancient artifact", chance: 0.2, quantity: 1}
  ]);
  
  config.lootTables.set("kraken", [
    {item: "kraken tentacle", chance: 0.7, quantity: "2-5"},
    {item: "kraken ink", chance: 0.6, quantity: "1-3"},
    {item: "kraken eye", chance: 0.2, quantity: 1},
    {item: "sunken treasure", chance: 0.3, quantity: 1}
  ]);
}

// Initialize crafting recipes
function initializeCraftingRecipes() {
  // Weapons
  config.craftingRecipes.set("iron sword", {
    materials: [
      {item: "iron ingot", quantity: 3},
      {item: "leather strips", quantity: 1},
      {item: "wooden handle", quantity: 1}
    ],
    skill_required: 2,
    type: "weapon",
    stats: {damage: 15, durability: 100}
  });
  
  config.craftingRecipes.set("reinforced bow", {
    materials: [
      {item: "flexible wood", quantity: 2},
      {item: "bowstring", quantity: 1},
      {item: "iron reinforcement", quantity: 1}
    ],
    skill_required: 3,
    type: "weapon",
    stats: {damage: 12, range: 30, durability: 80}
  });
  
  // Armor
  config.craftingRecipes.set("leather armor", {
    materials: [
      {item: "treated leather", quantity: 5},
      {item: "iron studs", quantity: 10},
      {item: "leather straps", quantity: 3}
    ],
    skill_required: 2,
    type: "armor",
    stats: {defense: 8, mobility: "high", durability: 60}
  });
  
  config.craftingRecipes.set("iron breastplate", {
    materials: [
      {item: "iron ingot", quantity: 5},
      {item: "leather padding", quantity: 2},
      {item: "steel rivets", quantity: 8}
    ],
    skill_required: 4,
    type: "armor",
    stats: {defense: 15, mobility: "medium", durability: 120}
  });
  
  // Potions
  config.craftingRecipes.set("healing potion", {
    materials: [
      {item: "red herbs", quantity: 3},
      {item: "clear water", quantity: 1},
      {item: "alchemical catalyst", quantity: 1}
    ],
    skill_required: 1,
    type: "potion",
    stats: {healing: 30, duration: "instant"}
  });
  
  config.craftingRecipes.set("strength elixir", {
    materials: [
      {item: "mountain flower", quantity: 2},
      {item: "troll blood", quantity: 1},
      {item: "alchemical catalyst", quantity: 1}
    ],
    skill_required: 3,
    type: "potion",
    stats: {strength_boost: 5, duration: "10 minutes"}
  });
  
  // Special items
  config.craftingRecipes.set("dragon scale armor", {
    materials: [
      {item: "dragon scale", quantity: 15},
      {item: "steel ingot", quantity: 5},
      {item: "enchanted thread", quantity: 3},
      {item: "master craftsman's tools", quantity: 1}
    ],
    skill_required: 8,
    type: "armor",
    stats: {defense: 30, fire_resistance: "high", durability: 300}
  });
  
  config.craftingRecipes.set("kraken-bone trident", {
    materials: [
      {item: "kraken tentacle", quantity: 3},
      {item: "kraken tooth", quantity: 2},
      {item: "enchanted steel", quantity: 3},
      {item: "ocean gem", quantity: 1}
    ],
    skill_required: 8,
    type: "weapon",
    stats: {damage: 35, water_damage: 15, durability: 250}
  });
}

// Initialize tupper avatars for GM
function initializeTupperAvatars() {
  config.tupperAvatars.set("tavern_keeper", {
    name: "Barkeep Gorm",
    avatar: "https://i.imgur.com/tBe3xW7.png",
    description: "A burly man with a thick beard and forearms like tree trunks. His tavern has seen it all.",
    personality: "Gruff but fair, knows all the local gossip, surprisingly wise"
  });
  
  config.tupperAvatars.set("village_elder", {
    name: "Elder Myrtle",
    avatar: "https://i.imgur.com/L8dXNC7.png",
    description: "An elderly woman with silver hair and knowing eyes that miss nothing.",
    personality: "Patient, cautious, keeper of ancient wisdom"
  });
  
  config.tupperAvatars.set("mysterious_stranger", {
    name: "The Hooded Figure",
    avatar: "https://i.imgur.com/D5qUX0d.png",
    description: "A cloaked individual whose face remains in shadow. Their motives are unclear.",
    personality: "Enigmatic, speaks in riddles, has secret knowledge"
  });
  
  config.tupperAvatars.set("guard_captain", {
    name: "Captain Thorne",
    avatar: "https://i.imgur.com/K8mGEz3.png",
    description: "A stern-faced woman in polished armor with numerous battle scars.",
    personality: "Disciplined, duty-bound, suspicious of strangers"
  });
  
  config.tupperAvatars.set("court_wizard", {
    name: "Magister Vex",
    avatar: "https://i.imgur.com/9O5VMgq.png",
    description: "A robed figure with arcane symbols embroidered on their garments and a staff crackling with energy.",
    personality: "Intellectual, slightly arrogant, fascinated by magical phenomena"
  });
}

    "The alchemist's eyes gleam behind glass lenses. 'I require certain... ingredients. Perhaps we could help each other?'",
    "The captain of the guard looks you up and down. 'We could use capable hands on the wall tonight.'",
    "A hooded stranger passes you a sealed scroll. 'For your eyes alone,' they whisper before melting into the crowd."
  ],
  terrainTypes: ['forest', 'mountains', 'plains', 'desert', 'swamp', 'coast', 'hills'],
  resourceTypes: ['iron', 'gold', 'timber', 'stone', 'crops', 'herbs', 'gems']
};

// Create and configure the Discord client
function createClient() {
  const client = new Client({ 
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ] 
  });
  
  // Command collection
  client.commands = new Collection();
  
  // When the client is ready, register slash commands and log ready status
  client.once(Events.ClientReady, async readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    await registerCommands(readyClient);
  });
  
  // Handle interactions (slash commands)
  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing command ${interaction.commandName}:`, error);
      const response = { content: 'There was an error executing this command!', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(response);
      } else {
        await interaction.reply(response);
      }
    }
  });
  
  // Handle legacy message commands
  client.on(Events.MessageCreate, async message => {
    // Ignore messages from bots
    if (message.author.bot) return;
    
    // Legacy command handling
    if (message.content.startsWith('!ping')) {
      await message.reply('Pong!');
    }
  });
  
  // Add disconnect handling
  client.on('disconnect', (event) => {
    console.log('Bot disconnected from Discord:', event);
  });
  
  // Add error handling
  client.on('error', (error) => {
    console.error('Discord client error:', error.message);
  });
  
  // Define commands
  defineCommands(client);
  
  return client;
}

// Define all the commands for the bot
function defineCommands(client) {
  // BASIC COMMANDS
  const pingCommand = {
    data: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Replies with Pong!'),
    execute: async (interaction) => {
      await interaction.reply('Pong!');
    }
  };

  // PLAYER COMMANDS
  const characterCommand = {
    data: new SlashCommandBuilder()
      .setName('character')
      .setDescription('Manage your character')
      .addSubcommand(subcommand => 
        subcommand
          .setName('create')
          .setDescription('Create a new character')
          .addStringOption(option => 
            option.setName('name')
              .setDescription('Your character name')
              .setRequired(true))
          .addStringOption(option => 
            option.setName('class')
              .setDescription('Your character class')
              .setRequired(true)
              .addChoices(
                { name: 'Knight', value: 'knight' },
                { name: 'Archer', value: 'archer' },
                { name: 'Mage', value: 'mage' },
                { name: 'Cleric', value: 'cleric' },
                { name: 'Rogue', value: 'rogue' }
              )))
      .addSubcommand(subcommand => 
        subcommand
          .setName('view')
          .setDescription('View your character details')),
    execute: async (interaction) => {
      const subcommand = interaction.options.getSubcommand();
      const userId = interaction.user.id;
      
      if (subcommand === 'create') {
        const name = interaction.options.getString('name');
        const charClass = interaction.options.getString('class');
        
        const character = {
          name,
          class: charClass,
          level: 1,
          experience: 0,
          health: 100,
          maxHealth: 100,
          mana: 50,
          maxMana: 50,
          stamina: 100,
          maxStamina: 100,
          skills: getInitialSkills(charClass),
          attributes: getInitialAttributes(charClass),
          stats: {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10
          },
          inventory: ['basic rations', 'water flask'],
          equipment: {
            head: null,
            chest: null,
            legs: null,
            feet: null,
            mainHand: charClass === 'knight' ? 'basic sword' : (charClass === 'archer' ? 'simple bow' : (charClass === 'mage' ? 'apprentice staff' : 'simple dagger')),
            offHand: charClass === 'knight' ? 'wooden shield' : null
          },
          gold: 50,
          quests: [],
          beastsDefeated: [],
          craftingSkill: 1,
          reputation: 0,
          createdAt: new Date().toISOString()
        };
        
        config.playerData.set(userId, character);
        
        await interaction.reply(`Character created: ${name} the ${capitalizeFirstLetter(charClass)}`);
      } else if (subcommand === 'view') {
        const character = config.playerData.get(userId);
        
        if (!character) {
          await interaction.reply('You do not have a character. Create one with `/character create`');
          return;
        }
        
        let responseText = `**${character.name}** - Level ${character.level} ${capitalizeFirstLetter(character.class)}\n`;
        responseText += `Health: ${character.health}\n`;
        responseText += `Experience: ${character.experience}\n`;
        responseText += `Gold: ${character.gold}\n\n`;
        
        responseText += `**Skills:**\n`;
        for (const [skill, value] of Object.entries(character.skills)) {
          responseText += `${capitalizeFirstLetter(skill)}: ${value}\n`;
        }
        
        responseText += `\n**Inventory:**\n${character.inventory.join(', ')}\n`;
        
        await interaction.reply(responseText);
      }
    }
  };

  // AUTO-GM COMMAND
  const postCommand = {
    data: new SlashCommandBuilder()
      .setName('post')
      .setDescription('Post your roleplay action and get an auto-GM response')
      .addStringOption(option => 
        option.setName('action')
          .setDescription('Describe your action or speech')
          .setRequired(true)),
    execute: async (interaction) => {
      const action = interaction.options.getString('action');
      const userId = interaction.user.id;
      
      // Check if user has a character
      const character = config.playerData.get(userId);
      if (!character) {
        await interaction.reply('You need to create a character first with `/character create`');
        return;
      }

      // Generate GM response based on the action
      const gmResponse = generateGMResponse(action, character);
      
      await interaction.reply({
        content: `**${character.name}**: ${action}\n\n**GM**: ${gmResponse}`,
        allowedMentions: { parse: [] }
      });
    }
  };

  // KINGDOM MANAGEMENT COMMANDS
  const kingdomCommand = {
    data: new SlashCommandBuilder()
      .setName('kingdom')
      .setDescription('Manage your kingdom')
      .addSubcommand(subcommand => 
        subcommand
          .setName('view')
          .setDescription('View your kingdom details'))
      .addSubcommand(subcommand => 
        subcommand
          .setName('expand')
          .setDescription('Attempt to expand your kingdom (once per year)')),
    execute: async (interaction) => {
      const userId = interaction.user.id;
      const subcommand = interaction.options.getSubcommand();
      
      // Check if user has a kingdom
      const kingdom = config.kingdoms.get(userId);
      if (!kingdom && subcommand !== 'create') {
        await interaction.reply('You do not have a kingdom. Ask a Game Master to create one for you.');
        return;
      }
      
      if (subcommand === 'view') {
        let responseText = `**${kingdom.name}**\n`;
        responseText += `Ruler: ${kingdom.ruler}\n`;
        responseText += `Size: ${kingdom.size} provinces\n`;
        responseText += `Population: ${kingdom.population.toLocaleString()}\n`;
        responseText += `Terrain: ${kingdom.terrain.join(', ')}\n`;
        responseText += `Resources: ${kingdom.resources.join(', ')}\n`;
        responseText += `Treasury: ${kingdom.treasury} gold\n`;
        responseText += `Military Strength: ${kingdom.militaryStrength}\n`;
        
        await interaction.reply(responseText);
      } else if (subcommand === 'expand') {
        // Check expansion cooldown
        const lastExpansion = config.lastExpansion.get(userId) || 0;
        const currentTime = Date.now();
        
        if (currentTime - lastExpansion < config.expansionCooldown) {
          const remainingDays = Math.ceil((config.expansionCooldown - (currentTime - lastExpansion)) / (24 * 60 * 60 * 1000));
          await interaction.reply(`Your kingdom cannot expand yet. You must wait ${remainingDays} days before attempting another expansion.`);
          return;
        }
        
        // Roll for expansion success
        const roll = Math.floor(Math.random() * 4) + 1; // 1-4
        let result;
        
        switch (roll) {
          case 1:
            result = 'Your expansion attempts have failed. Scouts report hostile terrain and powerful enemies. No new territories gained.';
            break;
          case 2:
            kingdom.size += 1;
            kingdom.population += Math.floor(Math.random() * 1000) + 500;
            result = `Your kingdom has expanded slightly! You've gained 1 new province with modest resources.`;
            break;
          case 3:
            kingdom.size += 2;
            kingdom.population += Math.floor(Math.random() * 2000) + 1000;
            const newResource = config.resourceTypes[Math.floor(Math.random() * config.resourceTypes.length)];
            if (!kingdom.resources.includes(newResource)) {
              kingdom.resources.push(newResource);
            }
            result = `Your expansion was successful! You've gained 2 new provinces with a rich deposit of ${newResource}.`;
            break;
          case 4:
            kingdom.size += 3;
            kingdom.population += Math.floor(Math.random() * 3000) + 2000;
            const newTerrain = config.terrainTypes[Math.floor(Math.random() * config.terrainTypes.length)];
            if (!kingdom.terrain.includes(newTerrain)) {
              kingdom.terrain.push(newTerrain);
            }
            const newResources = config.resourceTypes[Math.floor(Math.random() * config.resourceTypes.length)];
            if (!kingdom.resources.includes(newResources)) {
              kingdom.resources.push(newResources);
            }
            kingdom.treasury += Math.floor(Math.random() * 500) + 200;
            result = `Remarkable success! Your kingdom has expanded by 3 provinces, including valuable ${newTerrain} terrain with abundant ${newResources}. Your explorers also discovered an ancient treasury worth ${kingdom.treasury} gold!`;
            break;
        }
        
        // Update kingdom and set cooldown
        config.kingdoms.set(userId, kingdom);
        config.lastExpansion.set(userId, currentTime);
        
        await interaction.reply(result);
      }
    }
  };

  // QUEST COMMAND
  const questCommand = {
    data: new SlashCommandBuilder()
      .setName('quest')
      .setDescription('Manage quests')
      .addSubcommand(subcommand => 
        subcommand
          .setName('list')
          .setDescription('List available quests'))
      .addSubcommand(subcommand => 
        subcommand
          .setName('start')
          .setDescription('Start a quest')
          .addStringOption(option => 
            option.setName('quest_id')
              .setDescription('ID of the quest to start')
              .setRequired(true))),
    execute: async (interaction) => {
      const subcommand = interaction.options.getSubcommand();
      
      if (subcommand === 'list') {
        await interaction.reply(`
**Available Quests:**

1. **The Lost Heirloom** - A noble family's treasured artifact has gone missing. Recover it from bandits in the forest.
2. **Goblin Threat** - Clear out a goblin camp that has been harassing travelers on the king's road.
3. **Mysterious Illness** - A village is suffering from an unknown sickness. Find the cause and cure.
4. **Dragon Sighting** - Investigate rumors of a dragon seen in the northern mountains.
5. **The Wizard's Tower** - An abandoned wizard's tower has suddenly shown signs of activity.

Use \`/quest start quest_id\` to begin a quest (replace quest_id with the number).
        `);
      } else if (subcommand === 'start') {
        const questId = interaction.options.getString('quest_id');
        const userId = interaction.user.id;
        
        // Check if user has a character
        const character = config.playerData.get(userId);
        if (!character) {
          await interaction.reply('You need to create a character first with `/character create`');
          return;
        }
        
        let questInfo;
        switch (questId) {
          case '1':
            questInfo = 'You set out to recover the lost heirloom. Your journey takes you to the dark forest...';
            break;
          case '2':
            questInfo = 'You prepare to deal with the goblin threat. The king\'s road must be made safe again...';
            break;
          case '3':
            questInfo = 'You travel to the afflicted village. People look at you with hope in their eyes...';
            break;
          case '4':
            questInfo = 'You journey to the northern mountains to investigate the dragon sightings...';
            break;
          case '5':
            questInfo = 'You approach the mysterious wizard\'s tower. Magic crackles in the air around you...';
            break;
          default:
            await interaction.reply('Invalid quest ID. Use `/quest list` to see available quests.');
            return;
        }
        
        await interaction.reply(`**Quest Started:** ${questInfo}`);
      }
    }
  };

  // ADMIN COMMANDS
  const adminCommand = {
    data: new SlashCommandBuilder()
      .setName('admin')
      .setDescription('Admin-only commands')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addSubcommand(subcommand => 
        subcommand
          .setName('create_kingdom')
          .setDescription('Create a kingdom for a player')
          .addUserOption(option => 
            option.setName('player')
              .setDescription('Player to create kingdom for')
              .setRequired(true))
          .addStringOption(option => 
            option.setName('kingdom_name')
              .setDescription('Name of the kingdom')
              .setRequired(true))
          .addStringOption(option => 
            option.setName('ruler_title')
              .setDescription('Title for the ruler')
              .setRequired(true)))
      .addSubcommand(subcommand => 
        subcommand
          .setName('delete_kingdom')
          .setDescription('Delete a player\'s kingdom')
          .addUserOption(option => 
            option.setName('player')
              .setDescription('Player whose kingdom to delete')
              .setRequired(true)))
      .addSubcommand(subcommand => 
        subcommand
          .setName('reset_expansion')
          .setDescription('Reset expansion cooldown for a player')
          .addUserOption(option => 
            option.setName('player')
              .setDescription('Player to reset expansion for')
              .setRequired(true))),
    execute: async (interaction) => {
      // Check if the user has admin permissions
      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        await interaction.reply({ content: 'You do not have permission to use admin commands.', ephemeral: true });
        return;
      }
      
      const subcommand = interaction.options.getSubcommand();
      const targetUser = interaction.options.getUser('player');
      const targetUserId = targetUser.id;
      
      if (subcommand === 'create_kingdom') {
        const kingdomName = interaction.options.getString('kingdom_name');
        const rulerTitle = interaction.options.getString('ruler_title');
        
        // Check if player already has a kingdom
        if (config.kingdoms.has(targetUserId)) {
          await interaction.reply(`${targetUser.username} already has a kingdom. Delete it first before creating a new one.`);
          return;
        }
        
        // Create new kingdom
        const startingTerrain = config.terrainTypes[Math.floor(Math.random() * config.terrainTypes.length)];
        const startingResource = config.resourceTypes[Math.floor(Math.random() * config.resourceTypes.length)];
        
        const kingdom = {
          name: kingdomName,
          ruler: `${rulerTitle} ${targetUser.username}`,
          size: 1,
          population: Math.floor(Math.random() * 1000) + 500,
          terrain: [startingTerrain],
          resources: [startingResource],
          treasury: 100,
          militaryStrength: 10,
          createdAt: new Date().toISOString()
        };
        
        config.kingdoms.set(targetUserId, kingdom);
        
        await interaction.reply(`Kingdom created for ${targetUser.username}: ${kingdomName}`);
      } else if (subcommand === 'delete_kingdom') {
        // Check if player has a kingdom
        if (!config.kingdoms.has(targetUserId)) {
          await interaction.reply(`${targetUser.username} does not have a kingdom.`);
          return;
        }
        
        // Delete kingdom
        config.kingdoms.delete(targetUserId);
        config.lastExpansion.delete(targetUserId);
        
        await interaction.reply(`Kingdom deleted for ${targetUser.username}.`);
      } else if (subcommand === 'reset_expansion') {
        // Check if player has a kingdom
        if (!config.kingdoms.has(targetUserId)) {
          await interaction.reply(`${targetUser.username} does not have a kingdom.`);
          return;
        }
        
        // Reset expansion cooldown
        config.lastExpansion.delete(targetUserId);
        
        await interaction.reply(`Expansion cooldown reset for ${targetUser.username}.`);
      }
    }
  };

  // MEDIEVAL LIFE COMMANDS
  const craftCommand = {
    data: new SlashCommandBuilder()
      .setName('craft')
      .setDescription('Craft an item')
      .addStringOption(option => 
        option.setName('item')
          .setDescription('Item to craft')
          .setRequired(true)
          .addChoices(
            { name: 'Sword', value: 'sword' },
            { name: 'Bow', value: 'bow' },
            { name: 'Shield', value: 'shield' },
            { name: 'Potion', value: 'potion' },
            { name: 'Armor', value: 'armor' }
          )),
    execute: async (interaction) => {
      const item = interaction.options.getString('item');
      const userId = interaction.user.id;
      
      // Check if user has a character
      const character = config.playerData.get(userId);
      if (!character) {
        await interaction.reply('You need to create a character first with `/character create`');
        return;
      }
      
      // Different crafting requirements and results based on item
      let response;
      let success = Math.random() > 0.3; // 70% success rate
      
      if (success) {
        switch (item) {
          case 'sword':
            response = 'You forge a fine steel sword at the blacksmith\'s anvil. Your weapon will serve you well in battle.';
            character.inventory.push('steel sword');
            break;
          case 'bow':
            response = 'You carefully shape the yew wood and string the bow. A masterful piece of craftsmanship.';
            character.inventory.push('yew bow');
            break;
          case 'shield':
            response = 'You craft a sturdy shield emblazoned with your personal emblem. It will provide good protection.';
            character.inventory.push('emblazoned shield');
            break;
          case 'potion':
            response = 'You mix herbs and reagents to create a healing potion. The liquid glows with a soft blue light.';
            character.inventory.push('healing potion');
            break;
          case 'armor':
            response = 'You craft a set of leather armor, reinforced with metal plates. It fits perfectly.';
            character.inventory.push('reinforced leather armor');
            break;
        }
      } else {
        response = `Your attempt to craft a ${item} fails. The materials are ruined, but you've learned something from the experience.`;
      }
      
      // Update player data
      config.playerData.set(userId, character);
      
      await interaction.reply(response);
    }
  };

  const huntCommand = {
    data: new SlashCommandBuilder()
      .setName('hunt')
      .setDescription('Go hunting for food and materials')
      .addStringOption(option => 
        option.setName('location')
          .setDescription('Where to hunt')
          .setRequired(true)
          .addChoices(
            { name: 'Forest', value: 'forest' },
            { name: 'Plains', value: 'plains' },
            { name: 'Mountains', value: 'mountains' },
            { name: 'Swamp', value: 'swamp' }
          )),
    execute: async (interaction) => {
      const location = interaction.options.getString('location');
      const userId = interaction.user.id;
      
      // Check if user has a character
      const character = config.playerData.get(userId);
      if (!character) {
        await interaction.reply('You need to create a character first with `/character create`');
        return;
      }
      
      let huntResults = [];
      const successChance = 0.7; // 70% success rate
      
      // Determine hunting results based on location
      if (Math.random() < successChance) {
        switch (location) {
          case 'forest':
            huntResults = ['deer', 'rabbit', 'pheasant', 'fox fur', 'wild berries'];
            break;
          case 'plains':
            huntResults = ['rabbit', 'pheasant', 'wild herbs', 'boar', 'duck'];
            break;
          case 'mountains':
            huntResults = ['mountain goat', 'wolf fur', 'eagle feathers', 'rare herbs', 'bear'];
            break;
          case 'swamp':
            huntResults = ['frog legs', 'snake skin', 'rare mushrooms', 'alligator', 'exotic herbs'];
            break;
        }
        
        // Select 1-3 random items from the possible results
        const numItems = Math.floor(Math.random() * 3) + 1;
        const huntedItems = [];
        
        for (let i = 0; i < numItems; i++) {
          const randomIndex = Math.floor(Math.random() * huntResults.length);
          huntedItems.push(huntResults[randomIndex]);
        }
        
        // Add items to inventory
        character.inventory.push(...huntedItems);
        
        // Update player data
        config.playerData.set(userId, character);
        
        await interaction.reply(`Your hunt in the ${location} was successful! You obtained: ${huntedItems.join(', ')}.`);
      } else {
        await interaction.reply(`Your hunt in the ${location} was unsuccessful. Perhaps you'll have better luck next time.`);
      }
    }
  };

  const marketCommand = {
    data: new SlashCommandBuilder()
      .setName('market')
      .setDescription('Visit the market to buy or sell items')
      .addSubcommand(subcommand => 
        subcommand
          .setName('buy')
          .setDescription('Buy an item from the market')
          .addStringOption(option => 
            option.setName('item')
              .setDescription('Item to buy')
              .setRequired(true)
              .addChoices(
                { name: 'Sword (50 gold)', value: 'sword' },
                { name: 'Bow (40 gold)', value: 'bow' },
                { name: 'Shield (30 gold)', value: 'shield' },
                { name: 'Potion (20 gold)', value: 'potion' },
                { name: 'Armor (60 gold)', value: 'armor' },
                { name: 'Horse (100 gold)', value: 'horse' },
                { name: 'Map (25 gold)', value: 'map' }
              )))
      .addSubcommand(subcommand => 
        subcommand
          .setName('sell')
          .setDescription('Sell an item to the market')
          .addStringOption(option => 
            option.setName('item')
              .setDescription('Item to sell')
              .setRequired(true))),
    execute: async (interaction) => {
      const subcommand = interaction.options.getSubcommand();
      const userId = interaction.user.id;
      
      // Check if user has a character
      const character = config.playerData.get(userId);
      if (!character) {
        await interaction.reply('You need to create a character first with `/character create`');
        return;
      }
      
      if (subcommand === 'buy') {
        const item = interaction.options.getString('item');
        const prices = {
          'sword': 50,
          'bow': 40,
          'shield': 30,
          'potion': 20,
          'armor': 60,
          'horse': 100,
          'map': 25
        };
        
        if (character.gold < prices[item]) {
          await interaction.reply(`You don't have enough gold to buy a ${item}. You need ${prices[item]} gold but only have ${character.gold}.`);
          return;
        }
        
        // Purchase the item
        character.gold -= prices[item];
        character.inventory.push(item);
        
        // Update player data
        config.playerData.set(userId, character);
        
        await interaction.reply(`You purchased a ${item} for ${prices[item]} gold. You now have ${character.gold} gold remaining.`);
      } else if (subcommand === 'sell') {
        const item = interaction.options.getString('item');
        
        // Check if the character has the item
        const itemIndex = character.inventory.findIndex(i => i.includes(item));
        
        if (itemIndex === -1) {
          await interaction.reply(`You don't have a ${item} to sell.`);
          return;
        }
        
        // Calculate sale price (random but reasonable)
        const salePrice = Math.floor(Math.random() * 30) + 10;
        
        // Sell the item
        character.inventory.splice(itemIndex, 1);
        character.gold += salePrice;
        
        // Update player data
        config.playerData.set(userId, character);
        
        await interaction.reply(`You sold a ${item} for ${salePrice} gold. You now have ${character.gold} gold.`);
      }
    }
  };

  // Initialize beasts, loot tables, and crafting recipes
  initializeBeasts();

  // Register all commands
  client.commands.set(pingCommand.data.name, pingCommand);
  client.commands.set(characterCommand.data.name, characterCommand);
  client.commands.set(postCommand.data.name, postCommand);
  client.commands.set(kingdomCommand.data.name, kingdomCommand);
  client.commands.set(questCommand.data.name, questCommand);
  client.commands.set(adminCommand.data.name, adminCommand);
  client.commands.set(craftCommand.data.name, craftCommand);
  client.commands.set(huntCommand.data.name, huntCommand);
  client.commands.set(marketCommand.data.name, marketCommand);
  
  // Register new commands
  client.commands.set(statsCommand.data.name, statsCommand);
  client.commands.set(fightCommand.data.name, fightCommand);
  client.commands.set(improvedCraftCommand.data.name, improvedCraftCommand);
  client.commands.set(restCommand.data.name, restCommand);
}

// Register slash commands with Discord API
async function registerCommands(client) {
  try {
    console.log('Started refreshing application (/) commands.');
    
    const rest = new REST().setToken(client.token);
    const commands = Array.from(client.commands.values()).map(command => command.data.toJSON());
    
    // The put method is used to fully refresh all commands with the current set
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );
    
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error refreshing application commands:', error);
  }
}

// Helper functions
function getInitialSkills(charClass) {
  switch (charClass) {
    case 'knight':
      return { strength: 8, defense: 7, archery: 3, magic: 1, stealth: 2 };
    case 'archer':
      return { strength: 5, defense: 4, archery: 9, magic: 2, stealth: 6 };
    case 'mage':
      return { strength: 2, defense: 3, archery: 3, magic: 9, stealth: 4 };
    case 'cleric':
      return { strength: 4, defense: 5, archery: 2, magic: 7, stealth: 3 };
    case 'rogue':
      return { strength: 5, defense: 3, archery: 6, magic: 2, stealth: 9 };
    default:
      return { strength: 5, defense: 5, archery: 5, magic: 5, stealth: 5 };
  }
}

function getInitialAttributes(charClass) {
  switch (charClass) {
    case 'knight':
      return { physicalDamage: 12, magicalDamage: 2, armor: 10, accuracy: 8, evasion: 5 };
    case 'archer':
      return { physicalDamage: 10, magicalDamage: 3, armor: 6, accuracy: 15, evasion: 12 };
    case 'mage':
      return { physicalDamage: 3, magicalDamage: 15, armor: 4, accuracy: 10, evasion: 8 };
    case 'cleric':
      return { physicalDamage: 6, magicalDamage: 10, armor: 8, accuracy: 9, evasion: 7 };
    case 'rogue':
      return { physicalDamage: 9, magicalDamage: 4, armor: 5, accuracy: 14, evasion: 15 };
    default:
      return { physicalDamage: 7, magicalDamage: 7, armor: 7, accuracy: 10, evasion: 10 };
  }
}

function increaseStats(character, actionType) {
  const stat = actionType === 'combat' ? 'strength' : 
               actionType === 'magic' ? 'intelligence' : 
               actionType === 'stealth' ? 'dexterity' : 
               actionType === 'social' ? 'charisma' : 
               actionType === 'crafting' ? 'wisdom' : 'constitution';
               
  // Increase relevant stat
  character.stats[stat] += config.statIncreaseRate;
  
  // Add experience
  character.experience += Math.floor(Math.random() * 5) + 5;
  
  // Check for level up
  if (character.experience >= character.level * config.xpToLevelRatio) {
    character.level += 1;
    
    // Increase max health, mana, and stamina on level up
    character.maxHealth += Math.floor(character.stats.constitution * 0.5);
    character.maxMana += Math.floor(character.stats.intelligence * 0.3);
    character.maxStamina += Math.floor(character.stats.dexterity * 0.3);
    
    // Refill health, mana, and stamina on level up
    character.health = character.maxHealth;
    character.mana = character.maxMana;
    character.stamina = character.maxStamina;
    
    return true; // Return true if leveled up
  }
  
  return false; // Return false if no level up
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function generateGMResponse(action, character) {
  // Get avatar based on context
  let avatar = null;
  let actionType = 'social'; // Default action type for stat progression
  
  // Detect context and determine appropriate avatar and action type
  if (action.toLowerCase().includes('tavern') || action.toLowerCase().includes('inn') || action.toLowerCase().includes('drink')) {
    avatar = config.tupperAvatars.get("tavern_keeper");
    actionType = 'social';
  } else if (action.toLowerCase().includes('magic') || action.toLowerCase().includes('spell') || action.toLowerCase().includes('cast')) {
    avatar = config.tupperAvatars.get("court_wizard");
    actionType = 'magic';
  } else if (action.toLowerCase().includes('guard') || action.toLowerCase().includes('soldier') || action.toLowerCase().includes('patrol')) {
    avatar = config.tupperAvatars.get("guard_captain");
    actionType = 'social';
  } else if (action.toLowerCase().includes('elder') || action.toLowerCase().includes('village') || action.toLowerCase().includes('wisdom')) {
    avatar = config.tupperAvatars.get("village_elder");
    actionType = 'social';
  } else if (action.toLowerCase().includes('mysterious') || action.toLowerCase().includes('stranger') || action.toLowerCase().includes('hooded')) {
    avatar = config.tupperAvatars.get("mysterious_stranger");
    actionType = 'stealth';
  }
  
  // Improve character stats based on action type
  const leveledUp = increaseStats(character, actionType);
  
  // Generate response based on keywords
  let response = '';
  
  if (action.toLowerCase().includes('attack') || action.toLowerCase().includes('fight') || action.toLowerCase().includes('battle')) {
    const weapons = ['sword', 'axe', 'mace', 'dagger', 'bow', 'staff', 'spear'];
    const randomWeapon = weapons[Math.floor(Math.random() * weapons.length)];
    response = `The enemy staggers from your ${randomWeapon} strike, eyes narrowing with renewed determination. "You'll pay for that," they growl, readying their weapon.`;
    actionType = 'combat';
  } else if (action.toLowerCase().includes('tavern') || action.toLowerCase().includes('inn') || action.toLowerCase().includes('drink')) {
    response = `The innkeeper slides another tankard your way. "Interesting tale, traveler. But have you heard what happened in the village across the mountains? They say dark magic is afoot."`;
  } else if (action.toLowerCase().includes('magic') || action.toLowerCase().includes('spell') || action.toLowerCase().includes('cast')) {
    response = `The air crackles with arcane energy as you channel your power. A nearby scholar watches with keen interest, scribbling notes in a worn journal.`;
  } else if (action.toLowerCase().includes('market') || action.toLowerCase().includes('shop') || action.toLowerCase().includes('buy') || action.toLowerCase().includes('sell')) {
    response = `The merchant examines your goods with a practiced eye. "I might be interested in this... for the right price, of course. Or perhaps you'd prefer to trade for something more valuable?"`;
  } else if (action.toLowerCase().includes('forest') || action.toLowerCase().includes('woods') || action.toLowerCase().includes('nature')) {
    response = `The forest whispers around you, ancient trees creaking in the wind. You sense watchful eyes tracking your movements from the undergrowth.`;
  } else if (action.toLowerCase().includes('craft') || action.toLowerCase().includes('forge') || action.toLowerCase().includes('make')) {
    response = `Your hands work skillfully with the materials, each movement deliberate and practiced. The finished product begins to take shape.`;
    actionType = 'crafting';
  } else if (action.toLowerCase().includes('sneak') || action.toLowerCase().includes('hide') || action.toLowerCase().includes('stealth')) {
    response = `You move silently, keeping to the shadows. Your footsteps make no sound as you navigate carefully through the area.`;
    actionType = 'stealth';
  } else if (action.toLowerCase().includes('heal') || action.toLowerCase().includes('treat') || action.toLowerCase().includes('bandage')) {
    response = `You apply the healing techniques you've learned, carefully treating the wounds. The bleeding stops and the pain begins to subside.`;
  } else if (action.toLowerCase().includes('climb') || action.toLowerCase().includes('jump') || action.toLowerCase().includes('run')) {
    response = `Your body responds to the challenge, muscles working in perfect coordination as you navigate the difficult terrain.`;
  } else {
    // Get a random GM response if no keywords matched
    response = config.gmResponses[Math.floor(Math.random() * config.gmResponses.length)];
  }
  
  // Add level up notification if applicable
  if (leveledUp) {
    response += `\n\n*You've gained experience from this interaction. You are now level ${character.level}!*`;
  }
  
  // Format with avatar if available
  if (avatar) {
    return `**${avatar.name}**: ${response}`;
  }
  
  return `**GM**: ${response}`;
}

// Initialize the bot
function initializeBot(token) {
  if (!token) {
    console.error('ERROR: No Discord token provided!');
    return null;
  }
  
  const client = createClient();
  
  console.log('Attempting to connect to Discord...');
  
  return client.login(token)
    .then(() => {
      console.log('Successfully logged in to Discord!');
      return client;
    })
    .catch(error => {
      console.error('Failed to log in to Discord:', error.message);
      console.log('Please check that:');
      console.log('1. Your bot token is correct in the Secrets tab');
      console.log('2. Your bot has the appropriate intents enabled in the Discord Developer Portal');
      console.log('3. Your bot has been invited to a server with the correct permissions');
      return null;
    });
}

module.exports = {
  initializeBot
};
// STATS COMMAND
const statsCommand = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('View or upgrade your character stats')
    .addSubcommand(subcommand => 
      subcommand
        .setName('view')
        .setDescription('View your character stats'))
    .addSubcommand(subcommand => 
      subcommand
        .setName('upgrade')
        .setDescription('Upgrade a stat')
        .addStringOption(option => 
          option.setName('stat')
            .setDescription('Stat to upgrade')
            .setRequired(true)
            .addChoices(
              { name: 'Strength', value: 'strength' },
              { name: 'Dexterity', value: 'dexterity' },
              { name: 'Constitution', value: 'constitution' },
              { name: 'Intelligence', value: 'intelligence' },
              { name: 'Wisdom', value: 'wisdom' },
              { name: 'Charisma', value: 'charisma' }
            ))
        .addIntegerOption(option => 
          option.setName('points')
            .setDescription('Points to spend (1-5)')
            .setRequired(true))),
  execute: async (interaction) => {
    const userId = interaction.user.id;
    const character = config.playerData.get(userId);
    
    if (!character) {
      await interaction.reply('You need to create a character first with `/character create`');
      return;
    }
    
    const subcommand = interaction.options.getSubcommand();
    
    if (subcommand === 'view') {
      const statsEmbed = {
        title: `${character.name}'s Statistics`,
        description: `Level ${character.level} ${capitalizeFirstLetter(character.class)}`,
        color: 0x0099ff,
        fields: [
          {
            name: 'Experience',
            value: `${character.experience}/${character.level * config.xpToLevelRatio} XP`,
            inline: true
          },
          {
            name: 'Health',
            value: `${character.health}/${character.maxHealth}`,
            inline: true
          },
          {
            name: 'Mana',
            value: `${character.mana}/${character.maxMana}`,
            inline: true
          },
          {
            name: '\u200B',
            value: '**Basic Stats**',
            inline: false
          },
          {
            name: 'Strength',
            value: character.stats.strength.toFixed(1),
            inline: true
          },
          {
            name: 'Dexterity',
            value: character.stats.dexterity.toFixed(1),
            inline: true
          },
          {
            name: 'Constitution',
            value: character.stats.constitution.toFixed(1),
            inline: true
          },
          {
            name: 'Intelligence',
            value: character.stats.intelligence.toFixed(1),
            inline: true
          },
          {
            name: 'Wisdom',
            value: character.stats.wisdom.toFixed(1),
            inline: true
          },
          {
            name: 'Charisma',
            value: character.stats.charisma.toFixed(1),
            inline: true
          },
          {
            name: '\u200B',
            value: '**Combat Attributes**',
            inline: false
          },
          {
            name: 'Physical Damage',
            value: character.attributes.physicalDamage.toFixed(1),
            inline: true
          },
          {
            name: 'Magical Damage',
            value: character.attributes.magicalDamage.toFixed(1),
            inline: true
          },
          {
            name: 'Armor',
            value: character.attributes.armor.toFixed(1),
            inline: true
          },
          {
            name: 'Accuracy',
            value: character.attributes.accuracy.toFixed(1),
            inline: true
          },
          {
            name: 'Evasion',
            value: character.attributes.evasion.toFixed(1),
            inline: true
          },
          {
            name: 'Crafting Skill',
            value: character.craftingSkill.toString(),
            inline: true
          }
        ],
        footer: {
          text: `Character created on ${new Date(character.createdAt).toLocaleDateString()}`
        }
      };
      
      await interaction.reply({ embeds: [statsEmbed] });
    } else if (subcommand === 'upgrade') {
      const statToUpgrade = interaction.options.getString('stat');
      const pointsToSpend = interaction.options.getInteger('points');
      
      if (pointsToSpend < 1 || pointsToSpend > 5) {
        await interaction.reply('You can only spend 1-5 points at a time.');
        return;
      }
      
      // Calculate cost based on current level and points to spend
      const costPerPoint = 50 * character.level;
      const totalCost = costPerPoint * pointsToSpend;
      
      if (character.gold < totalCost) {
        await interaction.reply(`You need ${totalCost} gold to upgrade ${statToUpgrade} by ${pointsToSpend} points. You only have ${character.gold} gold.`);
        return;
      }
      
      // Upgrade the stat
      character.stats[statToUpgrade] += pointsToSpend;
      character.gold -= totalCost;
      
      // Update derived attributes
      updateDerivedAttributes(character);
      
      // Save changes
      config.playerData.set(userId, character);
      
      await interaction.reply(`You spent ${totalCost} gold to increase your ${statToUpgrade} by ${pointsToSpend} points. Your ${statToUpgrade} is now ${character.stats[statToUpgrade]}.`);
    }
  }
};

// Function to update derived attributes based on base stats
function updateDerivedAttributes(character) {
  character.attributes.physicalDamage = character.stats.strength * 1.2;
  character.attributes.magicalDamage = character.stats.intelligence * 1.5;
  character.attributes.armor = character.stats.constitution * 0.8;
  character.attributes.accuracy = character.stats.dexterity * 1.2;
  character.attributes.evasion = character.stats.dexterity * 1.5;
  
  character.maxHealth = 100 + (character.stats.constitution * 5);
  character.maxMana = 50 + (character.stats.intelligence * 3);
  character.maxStamina = 100 + (character.stats.dexterity * 2);
}

// COMBAT COMMAND
const fightCommand = {
  data: new SlashCommandBuilder()
    .setName('fight')
    .setDescription('Fight a beast or monster')
    .addStringOption(option => 
      option.setName('beast')
        .setDescription('Type of beast to fight')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('strategy')
        .setDescription('Combat strategy to use')
        .setRequired(false)
        .addChoices(
          { name: 'Aggressive', value: 'aggressive' },
          { name: 'Defensive', value: 'defensive' },
          { name: 'Balanced', value: 'balanced' },
          { name: 'Tactical', value: 'tactical' }
        )),
  execute: async (interaction) => {
    const userId = interaction.user.id;
    const character = config.playerData.get(userId);
    
    if (!character) {
      await interaction.reply('You need to create a character first with `/character create`');
      return;
    }
    
    // Check if character has enough health
    if (character.health < character.maxHealth * 0.2) {
      await interaction.reply('You are too wounded to fight. Rest or use healing items first.');
      return;
    }
    
    const beastType = interaction.options.getString('beast').toLowerCase();
    const strategy = interaction.options.getString('strategy') || 'balanced';
    
    // Check if beast exists
    if (!config.beasts.has(beastType)) {
      await interaction.reply(`Beast type "${beastType}" not found. Use a valid beast name.`);
      return;
    }
    
    const beast = config.beasts.get(beastType);
    
    // Initialize combat
    await interaction.reply(`You encounter a ${beast.name}! ${beast.description}\n\nPrepare for combat!`);
    
    // Apply strategy modifiers
    let damageModifier = 1.0;
    let defenseModifier = 1.0;
    let accuracyModifier = 1.0;
    let evasionModifier = 1.0;
    
    switch (strategy) {
      case 'aggressive':
        damageModifier = 1.3;
        defenseModifier = 0.7;
        accuracyModifier = 1.1;
        evasionModifier = 0.8;
        break;
      case 'defensive':
        damageModifier = 0.7;
        defenseModifier = 1.3;
        accuracyModifier = 0.9;
        evasionModifier = 1.2;
        break;
      case 'tactical':
        damageModifier = 1.1;
        defenseModifier = 0.9;
        accuracyModifier = 1.3;
        evasionModifier = 1.0;
        break;
      // balanced is default (all modifiers at 1.0)
    }
    
    // Combat simulation
    let beastHealth = beast.health;
    let rounds = 0;
    let combatLog = [];
    
    while (beastHealth > 0 && character.health > 0 && rounds < 20) {
      rounds++;
      
      // Player's turn
      const hitChance = Math.min(0.95, (character.attributes.accuracy * accuracyModifier) / (beast.difficulty === 'easy' ? 10 : beast.difficulty === 'medium' ? 15 : beast.difficulty === 'hard' ? 20 : 25));
      
      if (Math.random() < hitChance) {
        // Hit
        const damage = Math.max(1, Math.floor((character.attributes.physicalDamage * damageModifier) - (beast.armor / 2)));
        beastHealth -= damage;
        combatLog.push(`Round ${rounds}: You hit the ${beast.name} for ${damage} damage! ${beast.name} has ${Math.max(0, beastHealth)} health remaining.`);
      } else {
        // Miss
        combatLog.push(`Round ${rounds}: Your attack misses the ${beast.name}!`);
      }
      
      // Check if beast is defeated
      if (beastHealth <= 0) {
        break;
      }
      
      // Beast's turn
      const dodgeChance = Math.min(0.8, (character.attributes.evasion * evasionModifier) / 100);
      
      if (Math.random() >= dodgeChance) {
        // Beast hits
        const attackMessage = beast.attackMessages[Math.floor(Math.random() * beast.attackMessages.length)];
        const damage = Math.max(1, Math.floor(beast.damage - (character.attributes.armor * defenseModifier / 2)));
        character.health -= damage;
        combatLog.push(`Round ${rounds}: ${attackMessage} You take ${damage} damage! You have ${Math.max(0, character.health)} health remaining.`);
      } else {
        // Beast misses
        combatLog.push(`Round ${rounds}: You dodge the ${beast.name}'s attack!`);
      }
    }
    
    // Combat outcome
    let result = '';
    if (beastHealth <= 0) {
      // Victory
      const xpGained = beast.xp;
      const goldGained = beast.gold + Math.floor(Math.random() * beast.gold / 2);
      
      character.experience += xpGained;
      character.gold += goldGained;
      
      // Check if beast was already defeated before
      if (!character.beastsDefeated.includes(beastType)) {
        character.beastsDefeated.push(beastType);
      }
      
      // Generate loot
      const loot = generateLoot(beastType);
      if (loot.length > 0) {
        character.inventory.push(...loot);
      }
      
      // Check for level up
      if (character.experience >= character.level * config.xpToLevelRatio) {
        character.level += 1;
        character.maxHealth += Math.floor(character.stats.constitution * 0.5);
        character.maxMana += Math.floor(character.stats.intelligence * 0.3);
        character.maxStamina += Math.floor(character.stats.dexterity * 0.3);
        result += `\n🎉 You leveled up! You are now level ${character.level}!`;
      }
      
      result = `Victory! You defeated the ${beast.name} after ${rounds} rounds of combat.\n`;
      result += `You gained ${xpGained} XP and ${goldGained} gold.`;
      
      if (loot.length > 0) {
        result += `\nLoot obtained: ${loot.join(', ')}`;
      }
      
      // Skill increase
      increaseStats(character, 'combat');
    } else {
      // Defeat
      character.health = Math.max(1, character.health); // Don't let character die
      result = `Defeat! The ${beast.name} was too powerful. You retreat with ${character.health} health remaining.\n`;
      result += `You should rest and heal before attempting this fight again.`;
    }
    
    // Save character data
    config.playerData.set(userId, character);
    
    // Send combat log and result
    const combatSummary = combatLog.join('\n');
    
    // If combat log is too long, split into multiple messages
    if (combatSummary.length > 1500) {
      const firstPart = combatSummary.substring(0, 1500) + '...';
      await interaction.followUp(firstPart);
      await interaction.followUp(result);
    } else {
      await interaction.followUp(combatSummary + '\n\n' + result);
    }
  }
};

// Function to generate loot from a beast
function generateLoot(beastType) {
  if (!config.lootTables.has(beastType)) {
    return [];
  }
  
  const lootTable = config.lootTables.get(beastType);
  const lootObtained = [];
  
  for (const lootEntry of lootTable) {
    if (Math.random() < lootEntry.chance) {
      let quantity = 1;
      
      if (typeof lootEntry.quantity === 'string' && lootEntry.quantity.includes('-')) {
        // Parse range like "1-3"
        const [min, max] = lootEntry.quantity.split('-').map(Number);
        quantity = Math.floor(Math.random() * (max - min + 1)) + min;
      } else if (typeof lootEntry.quantity === 'number') {
        quantity = lootEntry.quantity;
      }
      
      for (let i = 0; i < quantity; i++) {
        lootObtained.push(lootEntry.item);
      }
    }
  }
  
  return lootObtained;
}

// IMPROVED CRAFTING COMMAND
const improvedCraftCommand = {
  data: new SlashCommandBuilder()
    .setName('crafting')
    .setDescription('Advanced crafting system')
    .addSubcommand(subcommand => 
      subcommand
        .setName('list')
        .setDescription('List available crafting recipes'))
    .addSubcommand(subcommand => 
      subcommand
        .setName('craft')
        .setDescription('Craft an item')
        .addStringOption(option => 
          option.setName('item')
            .setDescription('Item to craft')
            .setRequired(true)))
    .addSubcommand(subcommand => 
      subcommand
        .setName('inventory')
        .setDescription('View your crafting materials')),
  execute: async (interaction) => {
    const userId = interaction.user.id;
    const character = config.playerData.get(userId);
    
    if (!character) {
      await interaction.reply('You need to create a character first with `/character create`');
      return;
    }
    
    const subcommand = interaction.options.getSubcommand();
    
    if (subcommand === 'list') {
      // Filter recipes based on character's crafting skill
      const availableRecipes = [];
      
      for (const [itemName, recipe] of config.craftingRecipes.entries()) {
        if (recipe.skill_required <= character.craftingSkill) {
          availableRecipes.push({
            name: itemName,
            materials: recipe.materials.map(mat => `${mat.quantity}x ${mat.item}`).join(', '),
            type: recipe.type,
            skill: recipe.skill_required
          });
        }
      }
      
      if (availableRecipes.length === 0) {
        await interaction.reply('You don\'t know any crafting recipes yet. Increase your crafting skill to unlock recipes.');
        return;
      }
      
      // Sort recipes by skill required
      availableRecipes.sort((a, b) => a.skill - b.skill);
      
      // Create recipe list in pages if needed
      let recipeList = '**Available Crafting Recipes**\n\n';
      
      for (const recipe of availableRecipes) {
        recipeList += `**${capitalizeFirstLetter(recipe.name)}** (${capitalizeFirstLetter(recipe.type)}, Skill ${recipe.skill})\n`;
        recipeList += `Materials: ${recipe.materials}\n\n`;
      }
      
      await interaction.reply(recipeList);
    } else if (subcommand === 'craft') {
      const itemToCraft = interaction.options.getString('item').toLowerCase();
      
      // Check if recipe exists
      if (!config.craftingRecipes.has(itemToCraft)) {
        await interaction.reply(`Recipe for "${itemToCraft}" not found. Use \`/crafting list\` to see available recipes.`);
        return;
      }
      
      const recipe = config.craftingRecipes.get(itemToCraft);
      
      // Check crafting skill
      if (character.craftingSkill < recipe.skill_required) {
        await interaction.reply(`Your crafting skill (${character.craftingSkill}) is too low to craft a ${itemToCraft}. You need a skill of ${recipe.skill_required}.`);
        return;
      }
      
      // Check materials
      const missingMaterials = [];
      for (const material of recipe.materials) {
        const materialCount = character.inventory.filter(item => item === material.item).length;
        if (materialCount < material.quantity) {
          missingMaterials.push(`${material.item} (have ${materialCount}/${material.quantity})`);
        }
      }
      
      if (missingMaterials.length > 0) {
        await interaction.reply(`You lack the materials to craft a ${itemToCraft}. Missing materials:\n${missingMaterials.join('\n')}`);
        return;
      }
      
      // Remove materials from inventory
      for (const material of recipe.materials) {
        for (let i = 0; i < material.quantity; i++) {
          const index = character.inventory.indexOf(material.item);
          if (index !== -1) {
            character.inventory.splice(index, 1);
          }
        }
      }
      
      // Add crafted item to inventory
      character.inventory.push(itemToCraft);
      
      // Increase crafting skill occasionally
      if (Math.random() < 0.3) {
        character.craftingSkill += 1;
        await interaction.reply(`You successfully crafted a ${itemToCraft}! Your skill has improved - you are now Crafting level ${character.craftingSkill}.`);
      } else {
        await interaction.reply(`You successfully crafted a ${itemToCraft}!`);
      }
      
      // Save character data
      config.playerData.set(userId, character);
    } else if (subcommand === 'inventory') {
      // Count materials in inventory
      const materials = {};
      
      for (const item of character.inventory) {
        if (materials[item]) {
          materials[item]++;
        } else {
          materials[item] = 1;
        }
      }
      
      // Create inventory list
      let inventoryList = '**Your Crafting Materials**\n\n';
      
      for (const [item, count] of Object.entries(materials)) {
        inventoryList += `${item}: ${count}\n`;
      }
      
      await interaction.reply(inventoryList);
    }
  }
};

// REST COMMAND
const restCommand = {
  data: new SlashCommandBuilder()
    .setName('rest')
    .setDescription('Rest to recover health and mana')
    .addStringOption(option => 
      option.setName('location')
        .setDescription('Where to rest')
        .setRequired(true)
        .addChoices(
          { name: 'Inn (costs gold)', value: 'inn' },
          { name: 'Campsite (slower, free)', value: 'camp' }
        )),
  execute: async (interaction) => {
    const userId = interaction.user.id;
    const character = config.playerData.get(userId);
    
    if (!character) {
      await interaction.reply('You need to create a character first with `/character create`');
      return;
    }
    
    const location = interaction.options.getString('location');
    
    if (location === 'inn') {
      const cost = Math.floor(character.level * 5);
      
      if (character.gold < cost) {
        await interaction.reply(`You need ${cost} gold to rest at the inn. You only have ${character.gold} gold.`);
        return;
      }
      
      character.gold -= cost;
      character.health = character.maxHealth;
      character.mana = character.maxMana;
      character.stamina = character.maxStamina;
      
      await interaction.reply(`You rest comfortably at the inn for ${cost} gold. Your health, mana, and stamina are fully restored.`);
    } else if (location === 'camp') {
      // Campsite restores 50% of resources
      const healthRestored = Math.floor(character.maxHealth * 0.5);
      const manaRestored = Math.floor(character.maxMana * 0.5);
      const staminaRestored = Math.floor(character.maxStamina * 0.5);
      
      character.health = Math.min(character.maxHealth, character.health + healthRestored);
      character.mana = Math.min(character.maxMana, character.mana + manaRestored);
      character.stamina = Math.min(character.maxStamina, character.stamina + staminaRestored);
      
      await interaction.reply(`You make camp under the stars. The rest restores ${healthRestored} health, ${manaRestored} mana, and ${staminaRestored} stamina.`);
    }
    
    // Save character data
    config.playerData.set(userId, character);
  }
};
