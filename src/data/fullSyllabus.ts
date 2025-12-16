
import { Chapter } from "../types";

interface SyllabusData {
    chapters: { title: string; description: string }[];
}

export const FULL_SYLLABUS: Record<string, SyllabusData> = {
    // =========================================================================================
    // CLASS 6
    // =========================================================================================
    "CBSE-6-Science": {
        chapters: [
            { title: "Food: Where Does It Come From?", description: "Sources of food, plant parts and animal products as food." },
            { title: "Components of Food", description: "Nutrients, balanced diet, deficiency diseases." },
            { title: "Fibre to Fabric", description: "Variety in fabrics, fibre, spinning, yarn to fabric." },
            { title: "Sorting Materials into Groups", description: "Properties of materials like hardness, solubility, transparency." },
            { title: "Separation of Substances", description: "Methods like handpicking, threshing, winnowing, sieving, sedimentation." },
            { title: "Changes Around Us", description: "Reversible and irreversible changes." },
            { title: "Getting to Know Plants", description: "Herbs, shrubs, trees, stem, leaf, root, flower structure." },
            { title: "Body Movements", description: "Human skeleton, joints, gait of animals." },
            { title: "The Living Organisms — Characteristics and Habitats", description: "Biotic and abiotic components, adaptations." },
            { title: "Motion and Measurement of Distances", description: "Standard units of measurement, types of motion." },
            { title: "Light, Shadows and Reflections", description: "Transparent, opaque, translucent objects, shadows, pinhole camera." },
            { title: "Electricity and Circuits", description: "Electric cell, bulb, circuits, conductors and insulators." },
            { title: "Fun with Magnets", description: "Discovery of magnets, magnetic and non-magnetic materials, poles." },
            { title: "Water", description: "Uses, water cycle, conservation, rainwater harvesting." },
            { title: "Air Around Us", description: "Composition of air, oxygen for burning/respiration." },
            { title: "Garbage In, Garbage Out", description: "Waste management, vermicomposting, recycling." }
        ]
    },
    "CBSE-6-Mathematics": {
        chapters: [
            { title: "Knowing Our Numbers", description: "Comparing numbers, large numbers, roman numerals." },
            { title: "Whole Numbers", description: "Predecessor and successor, number line, properties of whole numbers." },
            { title: "Playing with Numbers", description: "Factors and multiples, prime/composite numbers, divisibility tests." },
            { title: "Basic Geometrical Ideas", description: "Points, lines, rays, curves, polygons, angles." },
            { title: "Understanding Elementary Shapes", description: "Measuring lines, angles, triangles, quadrilaterals, 3D shapes." },
            { title: "Integers", description: "Positive and negative numbers, ordering, addition/subtraction." },
            { title: "Fractions", description: "Types of fractions, number line, equivalent fractions." },
            { title: "Decimals", description: "Tenths, hundredths, comparing, addition/subtraction." },
            { title: "Data Handling", description: "Recording data, pictographs, bar graphs." },
            { title: "Mensuration", description: "Perimeter and area of rectangle/square." },
            { title: "Algebra", description: "Matchstick patterns, idea of a variable, equations." },
            { title: "Ratio and Proportion", description: "Concept of ratio, proportion, unitary method." },
            { title: "Symmetry", description: "Line of symmetry, reflection." },
            { title: "Practical Geometry", description: "Circle, line segment, perpendiculars, angles construction." }
        ]
    },
    "CBSE-6-Social Science": {
        chapters: [
            { title: "What, Where, How and When?", description: "Finding out about the past." },
            { title: "From Hunting–Gathering to Growing Food", description: "Earliest people, beginning of farming." },
            { title: "In the Earliest Cities", description: "Harappan civilization." },
            { title: "What Books and Burials Tell Us", description: "Vedas, megaliths." },
            { title: "Kingdoms, Kings and an Early Republic", description: "Janapadas, Mahajanapadas." },
            { title: "New Questions and Ideas", description: "Buddhism, Jainism, Upanishads." },
            { title: "Ashoka, The Emperor Who Gave Up War", description: "Mauryan empire." },
            { title: "Vital Villages, Thriving Towns", description: "Iron tools, agriculture, crafts." },
            { title: "Traders, Kings and Pilgrims", description: "Silk route, spread of Buddhism." },
            { title: "New Empires and Kingdoms", description: "Guptas, Harshavardhana." },
            { title: "Buildings, Paintings and Books", description: "Iron pillar, stupas, epics." },
            { title: "The Earth in the Solar System", description: "Planets, stars, moon." },
            { title: "Globe : Latitudes and Longitudes", description: "Equator, prime meridian, time zones." },
            { title: "Motions of the Earth", description: "Rotation, revolution, seasons." },
            { title: "Maps", description: "Types of maps, components." },
            { title: "Major Domains of the Earth", description: "Lithosphere, hydrosphere, atmosphere, biosphere." },
            { title: "Major Landforms of the Earth", description: "Mountains, plateaus, plains." },
            { title: "Our Country – India", description: "Location, neighbors, physical divisions." },
            { title: "India : Climate, Vegetation and Wildlife", description: "Seasons, forests, conservation." },
            { title: "Understanding Diversity", description: "Diversity in India." },
            { title: "Diversity and Discrimination", description: "Prejudice, inequality." },
            { title: "What is Government?", description: "Levels, laws, democracy." },
            { title: "Key Elements of a Democratic Government", description: "Participation, conflict resolution." },
            { title: "Panchayati Raj", description: "Gram sabha, gram panchayat." },
            { title: "Rural Administration", description: "Patwari, police station." },
            { title: "Urban Administration", description: "Municipal corporation." },
            { title: "Rural Livelihoods", description: "Farming, other occupations." },
            { title: "Urban Livelihoods", description: "Street vendors, factory workers." }
        ]
    },

    // =========================================================================================
    // CLASS 7
    // =========================================================================================
    "CBSE-7-Science": {
        chapters: [
            { title: "Nutrition in Plants", description: "Photosynthesis, modes of nutrition." },
            { title: "Nutrition in Animals", description: "Digestion in humans, grass-eating animals." },
            { title: "Fibre to Fabric", description: "Wool and silk processing." },
            { title: "Heat", description: "Thermometers, transfer of heat." },
            { title: "Acids, Bases and Salts", description: "Indicators, neutralization." },
            { title: "Physical and Chemical Changes", description: "Rusting, crystallization." },
            { title: "Weather, Climate and Adaptations", description: "Climate zones, animal adaptations." },
            { title: "Winds, Storms and Cyclones", description: "Air pressure, wind currents, safety measures." },
            { title: "Soil", description: "Soil profile, types, properties, erosion." },
            { title: "Respiration in Organisms", description: "Breathing, cellular respiration." },
            { title: "Transportation in Animals and Plants", description: "Circulatory system, excretion, transport in plants." },
            { title: "Reproduction in Plants", description: "Asexual and sexual reproduction, seed dispersal." },
            { title: "Motion and Time", description: "Speed, time measurement, distance-time graphs." },
            { title: "Electric Current and its Effects", description: "Heating and magnetic effects, electromagnet, bell." },
            { title: "Light", description: "Rectilinear propagation, mirrors, lenses." },
            { title: "Water: A Precious Resource", description: "Water table, scarcity, management." },
            { title: "Forests: Our Lifeline", description: "Structure of forest, interdependence." },
            { title: "Wastewater Story", description: "Sewage treatment, sanitation." }
        ]
    },
    "CBSE-7-Mathematics": {
        chapters: [
            { title: "Integers", description: "Properties of addition/subtraction/multiplication/division." },
            { title: "Fractions and Decimals", description: "Operations on fractions and decimals." },
            { title: "Data Handling", description: "Mean, median, mode, bar graphs, probability." },
            { title: "Simple Equations", description: "Solving equations, applications." },
            { title: "Lines and Angles", description: "Complementary/supplementary angles, transversal." },
            { title: "The Triangle and its Properties", description: "Medians, altitudes, angle sum, exterior angle." },
            { title: "Congruence of Triangles", description: "Criteria for congruence (SSS, SAS, ASA, RHS)." },
            { title: "Comparing Quantities", description: "Ratios, percentage, profit/loss, simple interest." },
            { title: "Rational Numbers", description: "Standard form, operations, finding between two numbers." },
            { title: "Practical Geometry", description: "Parallel lines, triangles construction." },
            { title: "Perimeter and Area", description: "Squares, rectangles, parallelograms, triangles, circles." },
            { title: "Algebraic Expressions", description: "Terms, factors, coefficients, operations." },
            { title: "Exponents and Powers", description: "Laws of exponents, standard form." },
            { title: "Symmetry", description: "Rotational symmetry." },
            { title: "Visualising Solid Shapes", description: "Faces, edges, vertices, nets." }
        ]
    },

    // =========================================================================================
    // CLASS 8
    // =========================================================================================
    "CBSE-8-Science": {
        chapters: [
            { title: "Crop Production and Management", description: "Agricultural practices." },
            { title: "Microorganisms: Friend and Foe", description: "Types, uses, harmful effects." },
            { title: "Synthetic Fibres and Plastics", description: "Types of synthetic fibres, plastics and environment." },
            { title: "Materials: Metals and Non-Metals", description: "Physical and chemical properties." },
            { title: "Coal and Petroleum", description: "Fossil fuels, refining." },
            { title: "Combustion and Flame", description: "Types of combustion, flame structure, fuel efficiency." },
            { title: "Conservation of Plants and Animals", description: "Deforestation, biosphere reserves, flora/fauna." },
            { title: "Cell — Structure and Functions", description: "Cell parts, plant vs animal cell." },
            { title: "Reproduction in Animals", description: "Sexual/asexual reproduction, metamorphosis." },
            { title: "Reaching the Age of Adolescence", description: "Puberty, hormones, reproductive health." },
            { title: "Force and Pressure", description: "Contact/non-contact forces, atmospheric pressure." },
            { title: "Friction", description: "Factors affecting friction, advantages/disadvantages." },
            { title: "Sound", description: "Production, propagation, characteristics, noise pollution." },
            { title: "Chemical Effects of Electric Current", description: "Conduction in liquids, electroplating." },
            { title: "Some Natural Phenomena", description: "Lightning, earthquakes." },
            { title: "Light", description: "Reflection, human eye, defects." },
            { title: "Stars and the Solar System", description: "Moon phases, constellations, planets." },
            { title: "Pollution of Air and Water", description: "Causes, effects, prevention." }
        ]
    },
    "CBSE-8-Mathematics": {
        chapters: [
            { title: "Rational Numbers", description: "Properties, representation on number line." },
            { title: "Linear Equations in One Variable", description: "Solving equations, word problems." },
            { title: "Understanding Quadrilaterals", description: "Polygons, types of quadrilaterals." },
            { title: "Practical Geometry", description: "Construction of quadrilaterals." },
            { title: "Data Handling", description: "Histograms, pie charts, probability." },
            { title: "Squares and Square Roots", description: "Finding square roots, Pythagorean triplets." },
            { title: "Cubes and Cube Roots", description: "Finding cube roots." },
            { title: "Comparing Quantities", description: "Discount, tax, compound interest." },
            { title: "Algebraic Expressions and Identities", description: "Multiplication, standard identities." },
            { title: "Visualising Solid Shapes", description: "Views of 3D shapes, Euler’s formula." },
            { title: "Mensuration", description: "Area of polygon, surface area/volume of cube/cuboid/cylinder." },
            { title: "Exponents and Powers", description: "Negative exponents, laws." },
            { title: "Direct and Inverse Proportions", description: "Solving problems." },
            { title: "Factorisation", description: "Methods of factorisation, division of polynomials." },
            { title: "Introduction to Graphs", description: "Line graphs, linear graphs." },
            { title: "Playing with Numbers", description: "General form, puzzles, divisibility." }
        ]
    },

    // =========================================================================================
    // CLASS 9
    // =========================================================================================
    "CBSE-9-Science": {
        chapters: [
            { title: "Matter in Our Surroundings", description: "States of matter, evaporation." },
            { title: "Is Matter Around Us Pure?", description: "Mixtures, solutions, separation techniques." },
            { title: "Atoms and Molecules", description: "Laws of combination, mole concept." },
            { title: "Structure of the Atom", description: "Electrons, protons, neutrons, isotopes." },
            { title: "The Fundamental Unit of Life", description: "Cell structure, organelles." },
            { title: "Tissues", description: "Plant and animal tissues." },
            { title: "Diversity in Living Organisms", description: "Classification hierarchy." },
            { title: "Motion", description: "Speed, velocity, acceleration, equations of motion." },
            { title: "Force and Laws of Motion", description: "Newton's laws, inertia, momentum." },
            { title: "Gravitation", description: "Universal law, free fall, mass/weight." },
            { title: "Work and Energy", description: "Work done, kinetic/potential energy, power." },
            { title: "Sound", description: "Production, propagation, echo, sonar." },
            { title: "Why Do We Fall Ill?", description: "Health, disease types, prevention." },
            { title: "Natural Resources", description: "Air, water, soil, cycles." },
            { title: "Improvement in Food Resources", description: "Crop improvement, animal husbandry." }
        ]
    },
    "CBSE-9-Mathematics": {
        chapters: [
            { title: "Number Systems", description: "Irrational numbers, real numbers, exponents." },
            { title: "Polynomials", description: "Remainder theorem, factor theorem, algebraic identities." },
            { title: "Coordinate Geometry", description: "Cartesian plane, plotting points." },
            { title: "Linear Equations in Two Variables", description: "Graphing, solutions." },
            { title: "Introduction to Euclid’s Geometry", description: "Axioms and postulates." },
            { title: "Lines and Angles", description: "Intersecting/parallel lines, angle sum property." },
            { title: "Triangles", description: "Congruence criteria, inequalities." },
            { title: "Quadrilaterals", description: "Properties of parallelograms, midpoint theorem." },
            { title: "Areas of Parallelograms and Triangles", description: "Area theorems." },
            { title: "Circles", description: "Chords, arcs, cyclic quadrilaterals." },
            { title: "Constructions", description: "Bisectors, angles, triangles." },
            { title: "Heron’s Formula", description: "Area of triangle." },
            { title: "Surface Areas and Volumes", description: "Cube, cuboid, sphere, cylinder, cone." },
            { title: "Statistics", description: "Data presentation, central tendency." },
            { title: "Probability", description: "Empirical probability." }
        ]
    },

    // =========================================================================================
    // CLASS 10 (Expanded)
    // =========================================================================================
    "CBSE-10-Science": {
        chapters: [
            { title: "Chemical Reactions and Equations", description: "Types of reactions, balancing." },
            { title: "Acids, Bases and Salts", description: "pH scale, salt families." },
            { title: "Metals and Non-metals", description: "Reactivity series, metallurgy." },
            { title: "Carbon and its Compounds", description: "Covalent bonds, hydrocarbons." },
            { title: "Periodic Classification of Elements", description: "Trends in periodic table." },
            { title: "Life Processes", description: "Nutrition, respiration, transport, excretion." },
            { title: "Control and Coordination", description: "Nervous system, hormones." },
            { title: "How do Organisms Reproduce?", description: "Asexual/sexual modes." },
            { title: "Heredity and Evolution", description: "Mendel's laws, speciation." },
            { title: "Light – Reflection and Refraction", description: "Mirrors, lenses, power." },
            { title: "The Human Eye and the Colorful World", description: "Defects, dispersion." },
            { title: "Electricity", description: "Ohm's law, circuits, power." },
            { title: "Magnetic Effects of Electric Current", description: "Field lines, motor, generator." },
            { title: "Sources of Energy", description: "Renewable vs non-renewable." },
            { title: "Our Environment", description: "Ecosystem, waste." },
            { title: "Sustainable Management of Natural Resources", description: "Conservation." }
        ]
    },
    "CBSE-10-Mathematics": {
        chapters: [
            { title: "Real Numbers", description: "Euclid’s lemma, irrational proofs." },
            { title: "Polynomials", description: "Zeros and coefficients." },
            { title: "Pair of Linear Equations in Two Variables", description: "Substitution, elimination." },
            { title: "Quadratic Equations", description: "Roots, nature of roots." },
            { title: "Arithmetic Progressions", description: "nth term, sum." },
            { title: "Triangles", description: "BPT, similarity." },
            { title: "Coordinate Geometry", description: "Distance, section formula." },
            { title: "Introduction to Trigonometry", description: "Ratios, identities." },
            { title: "Some Applications of Trigonometry", description: "Heights and distances." },
            { title: "Circles", description: "Tangents." },
            { title: "Constructions", description: "Tangents, line division." },
            { title: "Areas Related to Circles", description: "Sectors, segments." },
            { title: "Surface Areas and Volumes", description: "Combination of solids." },
            { title: "Statistics", description: "Mean, median, mode." },
            { title: "Probability", description: "Simple events." }
        ]
    },
    "CBSE-10-Social Science": {
        chapters: [
            { title: "The Rise of Nationalism in Europe", description: "French revolution, unification." },
            { title: "Nationalism in India", description: "Civil disobedience, non-cooperation." },
            { title: "The Making of a Global World", description: "Trade, colonization." },
            { title: "The Age of Industrialisation", description: "Factories, labor." },
            { title: "Resources and Development", description: "Soil types, conservation." },
            { title: "Forest and Wildlife Resources", description: "Flora, fauna conservation." },
            { title: "Water Resources", description: "Dams, rainwater harvesting." },
            { title: "Agriculture", description: "Crops, farming types." },
            { title: "Minerals and Energy Resources", description: "Ores, power plants." },
            { title: "Manufacturing Industries", description: "Location, pollution." },
            { title: "Lifelines of National Economy", description: "Transport, communication." },
            { title: "Power Sharing", description: "Belgium, Sri Lanka model." },
            { title: "Federalism", description: "Center-state relations." },
            { title: "Democracy and Diversity", description: "Social differences." },
            { title: "Gender, Religion and Caste", description: "Social issues." },
            { title: "Political Parties", description: "National/regional parties." },
            { title: "Outcomes of Democracy", description: "Accountability." },
            { title: "Development", description: "Income, HDI." },
            { title: "Sectors of the Indian Economy", description: "Primary, secondary, tertiary." },
            { title: "Money and Credit", description: "Banks, loans." },
            { title: "Globalisation and the Indian Economy", description: "MNCs, impact." },
            { title: "Consumer Rights", description: "Consumer protection act." }
        ]
    },

    // =========================================================================================
    // CLASS 11 (Science)
    // =========================================================================================
    "CBSE-11-Science-Physics": {
        chapters: [
            { title: "Physical World", description: "Scope of physics." },
            { title: "Units and Measurements", description: "SI units, errors." },
            { title: "Motion in a Straight Line", description: "Velocity, acceleration." },
            { title: "Motion in a Plane", description: "Vectors, projectile motion." },
            { title: "Laws of Motion", description: "Newton's laws, friction." },
            { title: "Work, Energy and Power", description: "Collisions, conservation." },
            { title: "System of Particles and Rotational Motion", description: "Center of mass, torque." },
            { title: "Gravitation", description: "Kepler's laws, satellites." },
            { title: "Mechanical Properties of Solids", description: "Stress, strain." },
            { title: "Mechanical Properties of Fluids", description: "Bernoulli's theorem, viscosity." },
            { title: "Thermal Properties of Matter", description: "Expansion, calorimetry." },
            { title: "Thermodynamics", description: "Laws, engines." },
            { title: "Kinetic Theory", description: "Gas laws." },
            { title: "Oscillations", description: "SHM." },
            { title: "Waves", description: "Doppler effect." }
        ]
    },
    "CBSE-11-Science-Chemistry": {
        chapters: [
            { title: "Some Basic Concepts of Chemistry", description: "Mole concept." },
            { title: "Structure of Atom", description: "Quantum numbers." },
            { title: "Classification of Elements and Periodicity", description: "Periodic trends." },
            { title: "Chemical Bonding and Molecular Structure", description: "VSEPR, hybridization." },
            { title: "States of Matter", description: "Gas laws, liquids." },
            { title: "Thermodynamics", description: "Enthalpy, entropy." },
            { title: "Equilibrium", description: "Kp, Kc, pH." },
            { title: "Redox Reactions", description: "Oxidation numbers." },
            { title: "Hydrogen", description: "Preparation, properties." },
            { title: "The s-Block Elements", description: "Alkali/alkaline earth metals." },
            { title: "The p-Block Elements", description: "Boron, carbon families." },
            { title: "Organic Chemistry – Some Basic Principles", description: "IUPAC, effects." },
            { title: "Hydrocarbons", description: "Alkanes, alkenes, alkynes." },
            { title: "Environmental Chemistry", description: "Pollution." }
        ]
    },
    "CBSE-11-Science-Biology": {
        chapters: [
            { title: "The Living World", description: "Taxonomy." },
            { title: "Biological Classification", description: "Five kingdom." },
            { title: "Plant Kingdom", description: "Algae to Angiosperms." },
            { title: "Animal Kingdom", description: "Phyla classification." },
            { title: "Morphology of Flowering Plants", description: "Root, stem, leaf." },
            { title: "Anatomy of Flowering Plants", description: "Tissues." },
            { title: "Structural Organisation in Animals", description: "Tissues, cockroach." },
            { title: "Cell: The Unit of Life", description: "Organelles." },
            { title: "Biomolecules", description: "Proteins, carbs." },
            { title: "Cell Cycle and Cell Division", description: "Mitosis, meiosis." },
            { title: "Transport in Plants", description: "Xylem, phloem." },
            { title: "Mineral Nutrition", description: "Essential elements." },
            { title: "Photosynthesis in Higher Plants", description: "Light/dark reactions." },
            { title: "Respiration in Plants", description: "Glycolysis, Krebs cycle." },
            { title: "Plant Growth and Development", description: "Hormones." },
            { title: "Digestion and Absorption", description: "Human system." },
            { title: "Breathing and Exchange of Gases", description: "Lungs." },
            { title: "Body Fluids and Circulation", description: "Heart, blood." },
            { title: "Excretory Products and their Elimination", description: "Kidney." },
            { title: "Locomotion and Movement", description: "Muscles, bones." },
            { title: "Neural Control and Coordination", description: "Brain, nerves." },
            { title: "Chemical Coordination and Integration", description: "Endocrine system." }
        ]
    },

    // =========================================================================================
    // CLASS 12 (Science)
    // =========================================================================================
    "CBSE-12-Science-Physics": {
        chapters: [
            { title: "Electric Charges and Fields", description: "Coulomb's law." },
            { title: "Electrostatic Potential and Capacitance", description: "Capacitors." },
            { title: "Current Electricity", description: "Kirchhoff's laws." },
            { title: "Moving Charges and Magnetism", description: "Biot-Savart law." },
            { title: "Magnetism and Matter", description: "Earth's magnetism." },
            { title: "Electromagnetic Induction", description: "Faraday's laws." },
            { title: "Alternating Current", description: "LCR, transformers." },
            { title: "Electromagnetic Waves", description: "Spectrum." },
            { title: "Ray Optics and Optical Instruments", description: "Lenses, microscopes." },
            { title: "Wave Optics", description: "Interference." },
            { title: "Dual Nature of Radiation and Matter", description: "Photoelectric effect." },
            { title: "Atoms", description: "Bohr model." },
            { title: "Nuclei", description: "Fission, fusion." },
            { title: "Semiconductor Electronics", description: "Diodes, transistors." }
        ]
    },
    "CBSE-12-Science-Chemistry": {
        chapters: [
            { title: "The Solid State", description: "Unit cells." },
            { title: "Solutions", description: "Colligative properties." },
            { title: "Electrochemistry", description: "Nernst equation." },
            { title: "Chemical Kinetics", description: "Rate laws." },
            { title: "Surface Chemistry", description: "Adsorption." },
            { title: "General Principles of Isolation of Elements", description: "Metallurgy." },
            { title: "The p-Block Elements", description: "Group 15-18." },
            { title: "The d- and f- Block Elements", description: "Transition metals." },
            { title: "Coordination Compounds", description: "IUPAC naming." },
            { title: "Haloalkanes and Haloarenes", description: "Reactions." },
            { title: "Alcohols, Phenols and Ethers", description: "Preparation." },
            { title: "Aldehydes, Ketones and Carboxylic Acids", description: "Reactions." },
            { title: "Amines", description: "Properties." },
            { title: "Biomolecules", description: "DNA, proteins." },
            { title: "Polymers", description: "Types." },
            { title: "Chemistry in Everyday Life", description: "Drugs, soaps." }
        ]
    },
    "CBSE-12-Science-Biology": {
        chapters: [
            { title: "Reproduction in Organisms", description: "Asexual/sexual." },
            { title: "Sexual Reproduction in Flowering Plants", description: "Pollination." },
            { title: "Human Reproduction", description: "Systems, cycle." },
            { title: "Reproductive Health", description: "Contraception." },
            { title: "Principles of Inheritance and Variation", description: "Genetics." },
            { title: "Molecular Basis of Inheritance", description: "DNA replication." },
            { title: "Evolution", description: "Darwinism." },
            { title: "Human Health and Disease", description: "Immunity." },
            { title: "Strategies for Enhancement in Food Production", description: "Breeding." },
            { title: "Microbes in Human Welfare", description: "Antibiotics." },
            { title: "Biotechnology: Principles and Processes", description: "rDNA." },
            { title: "Biotechnology and its Applications", description: "GMOs." },
            { title: "Organisms and Populations", description: "Ecology." },
            { title: "Ecosystem", description: "Energy flow." },
            { title: "Biodiversity and Conservation", description: "Hotspots." },
            { title: "Environmental Issues", description: "Pollution control." }
        ]
    },

    // =========================================================================================
    // CLASS 12 (Commerce)
    // =========================================================================================
    "CBSE-12-Commerce-Accountancy": {
        chapters: [
            { title: "NPO", description: "Not for profit orgs." },
            { title: "Partnership: Basic Concepts", description: "Deed." },
            { title: "Reconstitution: Admission", description: "New partner." },
            { title: "Reconstitution: Retirement/Death", description: "Leaving partner." },
            { title: "Dissolution", description: "Closing firm." },
            { title: "Share Capital", description: "Equity/Preference." },
            { title: "Debentures", description: "Debt." },
            { title: "Financial Statements", description: "Balance sheet." },
            { title: "Ratio Analysis", description: "Liquidity/Profitability." },
            { title: "Cash Flow", description: "Inflow/outflow." }
        ]
    },
    "CBSE-12-Commerce-Economics": {
        chapters: [
            { title: "Macroeconomics: National Income", description: "GDP, GNP." },
            { title: "Money and Banking", description: "RBI functions." },
            { title: "Income Determination", description: "Aggregate demand." },
            { title: "Government Budget", description: "Deficit/Surplus." },
            { title: "Balance of Payments", description: "Forex." },
            { title: "Indian Economy on Eve of Independence", description: "1947 status." },
            { title: "Indian Economy 1950-1990", description: "Five year plans." },
            { title: "LPG Policies", description: "Liberalisation." },
            { title: "Poverty", description: "Alleviation programs." },
            { title: "Human Capital Formation", description: "Education/Health." },
            { title: "Rural Development", description: "Credit/Marketing." },
            { title: "Employment", description: "Formal/Informal." },
            { title: "Infrastructure", description: "Energy/Transport." },
            { title: "Environment", description: "Sustainable dev." },
            { title: "Comparative Development", description: "India/China/Pakistan." }
        ]
    },
    "CBSE-12-Commerce-Business Studies": {
        chapters: [
            { title: "Nature and Significance of Management", description: "Levels." },
            { title: "Principles of Management", description: "Fayol/Taylor." },
            { title: "Business Environment", description: "PESTLE." },
            { title: "Planning", description: "Process." },
            { title: "Organising", description: "Structure." },
            { title: "Staffing", description: "HRM." },
            { title: "Directing", description: "Leadership." },
            { title: "Controlling", description: "Standards." },
            { title: "Financial Management", description: "Capital structure." },
            { title: "Financial Markets", description: "SEBI." },
            { title: "Marketing Management", description: "4Ps." },
            { title: "Consumer Protection", description: "Rights." }
        ]
    },

    // =========================================================================================
    // CLASS 12 (Arts)
    // =========================================================================================
    "CBSE-12-Arts-History": {
        chapters: [
            { title: "Bricks, Beads and Bones", description: "Harappan." },
            { title: "Kings, Farmers and Towns", description: "Early states." },
            { title: "Kinship, Caste and Class", description: "Mahabharata." },
            { title: "Thinkers, Beliefs and Buildings", description: "Buddhism." },
            { title: "Through the Eyes of Travellers", description: "Al-Biruni." },
            { title: "Bhakti-Sufi Traditions", description: "Religious movements." },
            { title: "Imperial Capital: Vijayanagara", description: "South India." },
            { title: "Peasants, Zamindars and State", description: "Mughal agrarian." },
            { title: "Kings and Chronicles", description: "Mughal courts." },
            { title: "Colonialism and Countryside", description: "British rule." },
            { title: "Rebels and the Raj", description: "1857 revolt." },
            { title: "Colonial Cities", description: "Urbanisation." },
            { title: "Mahatma Gandhi", description: "National movement." },
            { title: "Partition", description: "1947." },
            { title: "Constitution", description: "Framing." }
        ]
    },
    "CBSE-12-Arts-Political Science": {
        chapters: [
            { title: "Cold War Era", description: "US vs USSR." },
            { title: "End of Bipolarity", description: "Soviet collapse." },
            { title: "US Hegemony", description: "Dominance." },
            { title: "Alternative Centres of Power", description: "EU, ASEAN." },
            { title: "Contemporary South Asia", description: "India & neighbors." },
            { title: "International Organisations", description: "UN." },
            { title: "Security in Contemporary World", description: "Terrorism." },
            { title: "Environment and Natural Resources", description: "Global warming." },
            { title: "Globalisation", description: "Cultural/economic." },
            { title: "Nation Building", description: "Integration." },
            { title: "Era of One Party Dominance", description: "Congress." },
            { title: "Politics of Planned Development", description: "Five year plans." },
            { title: "India's External Relations", description: "Foreign policy." },
            { title: "Challenges to Congress System", description: "Restoration." },
            { title: "Crisis of Democratic Order", description: "Emergency." },
            { title: "Rise of Popular Movements", description: "Chipko, Dalit." },
            { title: "Regional Aspirations", description: "Punjab, NE." },
            { title: "Recent Developments", description: "Coalition era." }
        ]
    },

    // --- FALLBACK GENERIC STRUCTURE FOR MISSING CLASSES ---
    "GENERIC": {
        chapters: [
            { title: "Chapter 1: Basics and Introduction", description: "Foundational concepts." },
            { title: "Chapter 2: Fundamental Principles", description: "Core theories." },
            { title: "Chapter 3: Application and Analysis", description: "Real world usage." },
            { title: "Chapter 4: Advanced Topics", description: "Deep dive." },
            { title: "Chapter 5: Summary and Review", description: "Revision." }
        ]
    }
};
