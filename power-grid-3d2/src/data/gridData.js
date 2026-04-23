export const GRID_NODES = [
  {
    id: 'coal-plant',
    type: 'coal',
    label: 'Coal Power Plant',
    position: [-18, 0, -12],
    output: 1200,
    efficiency: 38,
    journeyStep: 'Generate',
    description:
      'Traditional coal-fired steam plant. Provides baseload power but emits significant CO2.',
    simpleExplain:
      'Burns coal to boil water, creating steam that spins a turbine to generate electricity.',
    analogy:
      'Like burning fuel in a large industrial boiler to keep a city powered continuously.',
    funFact:
      'One coal plant can power around 600,000 homes, but it also creates large carbon emissions.',
    stats: { capacity: '1200 MW', fuel: 'Coal', emissions: '820 g CO2/kWh', online: true },
  },
  {
    id: 'nuclear-plant',
    type: 'nuclear',
    label: 'Nuclear Power Plant',
    position: [-14, 0, 10],
    output: 2000,
    efficiency: 33,
    journeyStep: 'Generate',
    description:
      'Low-carbon baseload generation. Provides stable output independent of weather conditions.',
    simpleExplain:
      'Splits uranium atoms to release heat, which produces steam and drives turbines.',
    analogy:
      'Like a thermal plant powered by atomic energy instead of combustion fuel.',
    funFact:
      'Nuclear stations run at high availability and are among the most reliable large-scale sources.',
    stats: { capacity: '2000 MW', fuel: 'Uranium', emissions: '12 g CO2/kWh', online: true },
  },
  {
    id: 'solar-farm',
    type: 'solar',
    label: 'Solar Farm',
    position: [12, 0, -14],
    output: 400,
    efficiency: 22,
    journeyStep: 'Generate',
    description:
      'Photovoltaic solar array producing clean electricity from sunlight. Output varies with irradiance.',
    simpleExplain:
      'Panels convert sunlight directly into electricity through the photovoltaic effect.',
    analogy:
      'Like many light-powered devices scaled up to utility level.',
    funFact:
      'Solar output peaks around midday and falls rapidly near sunset.',
    stats: { capacity: '400 MW', fuel: 'Sunlight', emissions: '0 g CO2/kWh', online: true },
  },
  {
    id: 'wind-farm',
    type: 'wind',
    label: 'Wind Farm',
    position: [16, 0, 8],
    output: 300,
    efficiency: 45,
    journeyStep: 'Generate',
    description:
      'Onshore wind turbines convert kinetic wind energy into electricity. Output depends on wind speed.',
    simpleExplain:
      'Large blades rotate a generator when wind conditions are sufficient.',
    analogy:
      'Like a mechanical rotor that creates power when natural flow is available.',
    funFact:
      'Turbines operate in an optimal wind range and shut down during extreme conditions for safety.',
    stats: { capacity: '300 MW', fuel: 'Wind', emissions: '0 g CO2/kWh', online: true },
  },
  {
    id: 'substation-a',
    type: 'substation',
    label: 'Transmission Substation A',
    position: [-6, 0, -4],
    output: 0,
    efficiency: 99,
    journeyStep: 'Transmit',
    description:
      'Steps down 500 kV transmission voltage to 138 kV for regional distribution. Includes relays and breakers.',
    simpleExplain:
      'Adjusts very high-voltage power so it can move safely to the next part of the network.',
    analogy:
      'Like reducing high pressure in a trunk pipeline before local distribution.',
    funFact:
      'High-voltage transfer reduces line losses over long distances.',
    stats: { voltage: '500kV -> 138kV', load: '78%', status: 'Normal', online: true },
  },
  {
    id: 'substation-b',
    type: 'substation',
    label: 'Distribution Substation B',
    position: [6, 0, -2],
    output: 0,
    efficiency: 99,
    journeyStep: 'Distribute',
    description:
      'Steps down 138 kV to 12.47 kV for local feeders serving homes and businesses.',
    simpleExplain:
      'Performs the final major voltage reduction before neighborhood delivery.',
    analogy:
      'Like local pressure regulation before utility service reaches individual users.',
    funFact:
      'Multiple voltage transformation stages make transmission efficient and end-use safe.',
    stats: { voltage: '138kV -> 12.47kV', load: '65%', status: 'Normal', online: true },
  },
  {
    id: 'smart-meter-1',
    type: 'meter',
    label: 'Smart Meter Cluster',
    position: [2, 0, 6],
    output: 0,
    efficiency: 100,
    journeyStep: 'Measure',
    description:
      'Advanced metering infrastructure for two-way communication, interval data, and remote operations.',
    simpleExplain:
      'Digital meters send usage updates to utilities frequently for accurate visibility and billing.',
    analogy:
      'Like a connected telemetry device for household energy behavior.',
    funFact:
      'Interval readings improve demand forecasting and outage diagnostics.',
    stats: { units: '1,240 meters', interval: '15 min reads', communication: 'RF Mesh', online: true },
  },
  {
    id: 'sensor-grid',
    type: 'sensor',
    label: 'Grid Sensor Network',
    position: [-2, 0, 8],
    output: 0,
    efficiency: 100,
    journeyStep: 'Measure',
    description:
      'Phasor and fault sensors provide high-speed visibility into grid state and disturbances.',
    simpleExplain:
      'Distributed sensors continuously watch flow quality and help locate faults quickly.',
    analogy:
      'Like a live diagnostic nervous system spanning the grid.',
    funFact:
      'Fast sensor telemetry can shrink fault localization from hours to seconds.',
    stats: { sensors: '48 PMUs', latency: '<1 ms', coverage: '98%', online: true },
  },
  {
    id: 'battery-storage',
    type: 'battery',
    label: 'Battery Energy Storage',
    position: [-5, 0, -10],
    output: 200,
    efficiency: 92,
    journeyStep: 'Store',
    description:
      'Grid-scale lithium-ion battery supporting peak shaving, frequency regulation, and renewable balancing.',
    simpleExplain:
      'Stores surplus energy and releases it when demand rises or renewable output drops.',
    analogy:
      'Like a fast-response buffer that smooths supply and demand swings.',
    funFact:
      'Utility batteries can respond in milliseconds for grid frequency support.',
    stats: { capacity: '200 MW / 800 MWh', soc: '72%', mode: 'Charging', online: true },
  },
]

export const TRANSMISSION_LINES = [
  { from: 'coal-plant', to: 'substation-a' },
  { from: 'nuclear-plant', to: 'substation-a' },
  { from: 'solar-farm', to: 'substation-b' },
  { from: 'wind-farm', to: 'substation-b' },
  { from: 'battery-storage', to: 'substation-b' },
  { from: 'substation-a', to: 'substation-b' },
  { from: 'substation-b', to: 'smart-meter-1' },
  { from: 'substation-b', to: 'sensor-grid' },
]

export const CHART_DATA = {
  consumption: [320, 280, 250, 230, 240, 310, 420, 520, 580, 570, 560, 540, 530, 550, 560, 590, 610, 650, 640, 600, 580, 520, 460, 380],
  renewable: [0, 0, 0, 0, 0, 20, 80, 160, 220, 260, 280, 290, 300, 295, 285, 270, 240, 180, 100, 40, 10, 0, 0, 0],
  gridLoad: [65, 58, 52, 48, 50, 62, 78, 88, 94, 92, 90, 88, 87, 89, 90, 93, 96, 97, 97, 94, 91, 84, 76, 70],
}

export const TOUR_STEPS = [
  {
    target: null,
    emoji: 'Overview',
    title: 'How Electricity Reaches Consumers',
    body:
      'This 3D model represents a smart grid where generation, transmission, distribution, and IoT telemetry operate as one system.',
    analogy:
      'Think of a utility network that sources, transports, conditions, and delivers flow while monitoring each segment continuously.',
    tip: 'Click any highlighted node to inspect its role and live metrics.',
  },
  {
    target: 'coal-plant',
    emoji: 'GEN-1',
    title: 'Step 1: Baseload Generation',
    body:
      'Coal and nuclear facilities provide dependable baseload output to keep system frequency and supply stable throughout the day.',
    analogy: 'These are the primary supply engines that keep core demand served.',
    tip: 'Notice transmission lines leaving generation assets toward the first substation.',
  },
  {
    target: 'solar-farm',
    emoji: 'GEN-2',
    title: 'Step 2: Renewable Injection',
    body:
      'Solar and wind assets add clean generation, but output varies with weather and time, so balancing resources are required.',
    analogy: 'Variable supply streams that reduce emissions while needing firming support.',
    tip: 'Observe how storage and substations coordinate variable renewable output.',
  },
  {
    target: 'substation-a',
    emoji: 'TX',
    title: 'Step 3: High-Voltage Transmission',
    body:
      'Electricity moves long distances at high voltage to limit losses, then substations step it down for regional and local networks.',
    analogy: 'Bulk transfer first, precision delivery later.',
    tip: 'Voltage transformations at substations improve both safety and efficiency.',
  },
  {
    target: 'battery-storage',
    emoji: 'BESS',
    title: 'Step 4: Storage and Flexibility',
    body:
      'Grid batteries absorb excess energy and discharge during peaks, supporting frequency response and renewable integration.',
    analogy: 'A fast balancing buffer between variable supply and changing demand.',
    tip: 'Current state-of-charge and operating mode are shown in the detail panel.',
  },
  {
    target: 'smart-meter-1',
    emoji: 'IOT',
    title: 'Step 5: Smart Metering and Sensors',
    body:
      'Smart meters and sensors stream telemetry that improves forecasting, outage response, and operational decision-making.',
    analogy: 'A distributed measurement layer acting as the grid information backbone.',
    tip: 'Real-time data enables faster fault detection and recovery.',
  },
]

export const GLOSSARY = [
  { term: 'MW (Megawatt)', def: 'A power unit. 1 MW can support roughly hundreds of homes depending on local demand.' },
  { term: 'kV (Kilovolt)', def: 'A voltage unit. 1 kV equals 1,000 volts.' },
  { term: 'Baseload', def: 'Generation that runs consistently to meet foundational demand levels.' },
  { term: 'Renewable Energy', def: 'Electricity from replenishable sources such as solar and wind.' },
  { term: 'Efficiency (%)', def: 'The percentage of input energy converted to useful electrical output.' },
  { term: 'IoT', def: 'Connected devices that measure and exchange operational data.' },
  { term: 'PMU', def: 'Phasor Measurement Unit, a high-speed device for grid state measurement.' },
  { term: 'Substation', def: 'Facility used for voltage transformation and switching operations.' },
  { term: 'Smart Grid', def: 'A digitally monitored and controllable electricity network.' },
  { term: 'Grid Frequency', def: 'System frequency target that indicates real-time supply-demand balance.' },
]
