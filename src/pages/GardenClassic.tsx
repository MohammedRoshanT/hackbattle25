import React from 'react';
import GardenComponent from '../components/Garden';
import { useUser } from '../context/UserContext';
import { Tree } from '../types';

const GardenClassic: React.FC = () => {
  const { stats, spendWaterDrops } = useUser();

  const trees: Tree[] = Array.from({ length: Math.max(0, stats.totalTrees) }, (_, i) => ({
    id: String(i + 1),
    name: ['Oak Tree', 'Pine Tree', 'Palm Tree', 'Maple Tree'][i % 4],
    category: ['Web', 'JS', 'Python', 'DB'][i % 4],
    growthStage: ['seed', 'sprout', 'sapling', 'tree', 'giant'][Math.min(4, Math.floor(stats.plantGrowthLevel / 25))] as Tree['growthStage'],
    plantedAt: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000),
    waterDropsInvested: Math.floor(stats.plantGrowthLevel * 0.5),
  }));

  const onWaterTree = (treeId: string) => {
    // Simple cost model aligned with component's getWaterCost
    const tree = trees.find(t => t.id === treeId);
    if (!tree) return;
    const stage = tree.growthStage;
    const cost = stage === 'seed' ? 10 : stage === 'sprout' ? 25 : stage === 'sapling' ? 50 : stage === 'tree' ? 100 : 0;
    spendWaterDrops(cost);
  };

  const onPlantNewTree = () => {
    // UI-only: Planting flow handled elsewhere (Dashboard modal). No-op here.
    alert('Complete more challenges and water your plant to plant new trees!');
  };

  return (
    <GardenComponent
      trees={trees}
      waterDrops={stats.waterDrops}
      onWaterTree={onWaterTree}
      onPlantNewTree={onPlantNewTree}
    />
  );
};

export default GardenClassic;


