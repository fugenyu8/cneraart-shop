/**
 * 图表生成系统
 * 使用Chart.js生成各种数据可视化图表
 */

import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChartConfiguration } from 'chart.js';

const width = 600;
const height = 400;

/**
 * 生成雷达图(用于面相十二宫位分析)
 */
export async function generateRadarChart(data: {
  labels: string[];
  values: number[];
  title: string;
}): Promise<Buffer> {
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour: 'white' });

  const configuration: ChartConfiguration = {
    type: 'radar',
    data: {
      labels: data.labels,
      datasets: [{
        label: data.title,
        data: data.values,
        fill: true,
        backgroundColor: 'rgba(212, 175, 55, 0.2)', // 金黄色半透明
        borderColor: 'rgba(212, 175, 55, 1)', // 金黄色
        pointBackgroundColor: 'rgba(212, 175, 55, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(212, 175, 55, 1)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: false,
      scales: {
        r: {
          angleLines: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          },
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            stepSize: 20,
            font: {
              size: 12,
              family: 'Arial'
            }
          },
          pointLabels: {
            font: {
              size: 14,
              family: 'Arial'
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: data.title,
          font: {
            size: 18,
            family: 'Arial'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        }
      }
    }
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

/**
 * 生成柱状图(用于手相三大主线分析)
 */
export async function generateBarChart(data: {
  labels: string[];
  values: number[];
  title: string;
}): Promise<Buffer> {
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour: 'white' });

  const configuration: ChartConfiguration = {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: '评分',
        data: data.values,
        backgroundColor: [
          'rgba(212, 175, 55, 0.9)',   // 金黄色
          'rgba(212, 175, 55, 0.7)',   // 金黄色(浅)
          'rgba(212, 175, 55, 0.5)'    // 金黄色(更浅)
        ],
        borderColor: [
          'rgba(212, 175, 55, 1)',
          'rgba(212, 175, 55, 1)',
          'rgba(212, 175, 55, 1)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: false,
      indexAxis: 'y', // 水平柱状图
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20,
            font: {
              size: 12,
              family: 'Arial'
            }
          }
        },
        y: {
          ticks: {
            font: {
              size: 14,
              family: 'Arial'
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: data.title,
          font: {
            size: 18,
            family: 'Arial'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        }
      }
    }
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

/**
 * 生成八卦方位图(用于风水分析)
 */
export async function generateBaguaChart(data: {
  directions: string[]; // 八个方位名称
  scores: number[];     // 八个方位评分
  title: string;
}): Promise<Buffer> {
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour: 'white' });

  const configuration: ChartConfiguration = {
    type: 'polarArea',
    data: {
      labels: data.directions,
      datasets: [{
        label: '风水评分',
        data: data.scores,
        backgroundColor: [
          'rgba(212, 175, 55, 0.9)',  // 乾(西北) - 金黄色
          'rgba(212, 175, 55, 0.8)',  // 坤(西南) - 金黄色
          'rgba(212, 175, 55, 0.7)',  // 震(东) - 金黄色
          'rgba(212, 175, 55, 0.6)',  // 巽(东南) - 金黄色
          'rgba(139, 0, 0, 0.7)',     // 坎(北) - 深红色(点缀)
          'rgba(139, 0, 0, 0.6)',     // 离(南) - 深红色(点缀)
          'rgba(212, 175, 55, 0.5)',  // 艮(东北) - 金黄色
          'rgba(212, 175, 55, 0.4)'   // 兊(西) - 金黄色
        ],
        borderColor: [
          'rgba(212, 175, 55, 1)',
          'rgba(212, 175, 55, 1)',
          'rgba(212, 175, 55, 1)',
          'rgba(212, 175, 55, 1)',
          'rgba(139, 0, 0, 1)',
          'rgba(139, 0, 0, 1)',
          'rgba(212, 175, 55, 1)',
          'rgba(212, 175, 55, 1)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: false,
      scales: {
        r: {
          ticks: {
            display: false
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            font: {
              size: 12,
              family: 'Arial'
            },
            padding: 10
          }
        },
        title: {
          display: true,
          text: data.title,
          font: {
            size: 18,
            family: 'Arial'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        }
      }
    }
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

/**
 * 从报告内容中提取评分数据(面相)
 */
export function extractFaceScores(reportContent: string): {
  labels: string[];
  values: number[];
} {
  // 定义十二宫位
  const palaces = [
    '命宫', '财帛宫', '兄弟宫', '田宅宫', '子女宫', '奴仆宫',
    '妻妾宫', '疾厄宫', '迁移宫', '官禄宫', '福德宫', '父母宫'
  ];
  
  const labels: string[] = [];
  const values: number[] = [];
  
  // 从报告中提取评分
  for (const palace of palaces) {
    // 匹配 "**评分:** 85/100" 格式
    const regex = new RegExp(`${palace}[\\s\\S]*?\\*\\*评分:\\*\\*\\s+(\\d+)/100`, 'i');
    const match = reportContent.match(regex);
    
    if (match) {
      labels.push(palace);
      values.push(parseInt(match[1]));
    }
  }
  
  // 如果没有找到评分,使用默认值
  if (labels.length === 0) {
    return {
      labels: ['命宫', '财帛宫', '官禄宫', '田宅宫', '福德宫', '父母宫'],
      values: [85, 90, 80, 88, 92, 87]
    };
  }
  
  return { labels, values };
}

/**
 * 从报告内容中提取评分数据(手相)
 */
export function extractPalmScores(reportContent: string): {
  labels: string[];
  values: number[];
} {
  const lines = ['生命线', '智慧线', '感情线'];
  const labels: string[] = [];
  const values: number[] = [];
  
  for (const line of lines) {
    const regex = new RegExp(`${line}[\\s\\S]*?\\*\\*评分:\\*\\*\\s+(\\d+)/100`, 'i');
    const match = reportContent.match(regex);
    
    if (match) {
      labels.push(line);
      values.push(parseInt(match[1]));
    }
  }
  
  // 如果没有找到评分,使用默认值
  if (labels.length === 0) {
    return {
      labels: ['生命线', '智慧线', '感情线'],
      values: [88, 85, 90]
    };
  }
  
  return { labels, values };
}

/**
 * 从报告内容中提取评分数据(风水)
 */
export function extractFengshuiScores(reportContent: string): {
  directions: string[];
  scores: number[];
} {
  const bagua = [
    '乾位(西北)', '坤位(西南)', '震位(东)', '巽位(东南)',
    '坎位(北)', '离位(南)', '艮位(东北)', '兑位(西)'
  ];
  
  const directions: string[] = [];
  const scores: number[] = [];
  
  for (const direction of bagua) {
    // 提取方位名称(去掉括号内容)
    const dirName = direction.split('(')[0];
    const regex = new RegExp(`${dirName}[\\s\\S]*?\\*\\*评分:\\*\\*\\s+(\\d+)/100`, 'i');
    const match = reportContent.match(regex);
    
    if (match) {
      directions.push(direction);
      scores.push(parseInt(match[1]));
    }
  }
  
  // 如果没有找到评分,使用默认值
  if (directions.length === 0) {
    return {
      directions: bagua,
      scores: [85, 88, 82, 90, 87, 85, 83, 89]
    };
  }
  
  return { directions, scores };
}
