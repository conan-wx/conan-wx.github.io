/** Condensed, source-grounded copy for the paper pages. Full resumes remain in site-content.json. */
export const PROJECT_NOTES: Record<string, {
  shortTitle: string;
  challenge: string;
  approach: string;
  result: string;
  metric: string;
  metricLabel: string;
  visual: string;
}> = {
  "project-ai-memory": {
    shortTitle: "把记忆装进口袋",
    challenge: "让便携式智能体听懂对话、区分身份，并能检索过去的交流。",
    approach: "以 ESP32-S3 集成音频、通信与电源，结合语音服务、Milvus 检索和 FreeRTOS 多任务。",
    result: "完成可运行样机；续航约 6.4 小时，环境应力测试连续运行 48 小时无故障。",
    metric: "253 ms",
    metricLabel: "端到端语音交互平均延迟",
    visual: "memory",
  },
  "project-foc-servo": {
    shortTitle: "让电机精准回应",
    challenge: "连接电流、速度与位置控制，使电机响应运动指令并反馈运行状态。",
    approach: "基于 STM32G4 实现 FOC 与三级串级控制，使用 CANopen 对象字典交互指令和状态。",
    result: "多工况测试中，超调量不超过 5%，速度环扰动恢复时间小于 20 ms。",
    metric: "≤ 0.5°",
    metricLabel: "位置稳态误差",
    visual: "motor",
  },
  "project-magnetic-core": {
    shortTitle: "从数据读懂损耗",
    challenge: "分析材料、温度与励磁波形对磁芯损耗的影响，并寻找优化组合。",
    approach: "清洗 12000 余组数据，提取时频特征，对比预测模型并以 PSO 开展双目标优化。",
    result: "波形分类准确率 98.5%；同工况下磁芯损耗降低约 11.8%，获研数模国家三等奖。",
    metric: "0.972",
    metricLabel: "优选模型测试集 R²",
    visual: "wave",
  },
  "project-robot-inspection": {
    shortTitle: "在仿真厂区巡检",
    challenge: "让移动机器人依次到达巡检点，绕开障碍，并处理超时与任务失败。",
    approach: "在 Gazebo 中集成 ROS2、AMCL 与 Nav2，以 Python 状态机编排任务和失败重试。",
    result: "20 轮共 100 次导航任务成功 96 次；单轮平均耗时由 210 s 降至 182 s。",
    metric: "96 / 100",
    metricLabel: "固定路线仿真导航成功次数",
    visual: "robot",
  },
  "project-triple-pendulum": {
    shortTitle: "把三阶摆杆立起来",
    challenge: "仅用小车的水平驱动力，完成三级串联倒立摆的自动摆起与平衡。",
    approach: "用 MuJoCo 与 Gymnasium 构建环境，基于 PPO 将姿态、能量和位移纳入奖励设计。",
    result: "实现三根摆杆连续直立稳定 10 s 以上，并记录轨迹、位移和扰动恢复表现。",
    metric: "10 s+",
    metricLabel: "三根摆杆连续直立稳定时间",
    visual: "pendulum",
  },
  "project-stm32-pcb": {
    shortTitle: "从电路走向驱动板",
    challenge: "完成三相驱动电路与控制固件集成，验证功率、电流采样与散热表现。",
    approach: "以 KiCad 设计 STM32F4 控制板，优化功率及栅极回路，适配 FOC 固件和 CAN 通信。",
    result: "24 V 供电下验证 20 A 峰值相电流；10 A 连续相电流下 MOSFET 稳态温升 25℃。",
    metric: "92%",
    metricLabel: "驱动板测试效率",
    visual: "pcb",
  },
  "project-jetson-carrier": {
    shortTitle: "连接视觉与计算",
    challenge: "为 Jetson 计算模块连接摄像头、高速接口与宽压供电，并完成启动调试。",
    approach: "设计 MIPI、PCIe 和多路电源，制定差分阻抗约束，结合 Linux BSP 验证设备枚举。",
    result: "测试记录冷启动成功率 100%；满载关键器件稳态温升 30℃。",
    metric: "40 mVpp",
    metricLabel: "5 V 电源轨测试纹波",
    visual: "board",
  },
  "project-klayout-rdl": {
    shortTitle: "让版图自动生长",
    challenge: "将重复的封装版图绘制与规则检查，转化为可配置、可批量验证的流程。",
    approach: "以 Python 生成 5 类参数化单元，用 Ruby 编写 5 类 DRC 约束并输出违规报告。",
    result: "完成 12 组参数验证；单张版图由手动约 2 h 缩短至 30 s 以内，并支持多格式导出。",
    metric: "< 30 s",
    metricLabel: "单张参数化版图生成时间",
    visual: "layout",
  },
  "project-openems-package": {
    shortTitle: "看见封装里的电磁场",
    challenge: "建立封装互连三维模型，分析传输特性，并兼顾多尺度计算成本。",
    approach: "用 CSXCAD 和 openEMS 搭建 EC-FDTD 流程，局部加密网格，以 scikit-rf 提取 S 参数。",
    result: "网格总规模缩减 42%，单组仿真时长缩短 36%；完成 DC—18 GHz 传输特性分析。",
    metric: "42%",
    metricLabel: "网格总规模缩减",
    visual: "field",
  },
  "project-air-purifier": {
    shortTitle: "从净化原理到样机",
    challenge: "围绕蒸汽相变与颗粒团聚机理，完成净化结构设计和实验性能验证。",
    approach: "搭建测试平台，对材料和工况开展对照实验，迭代结构、运行参数及样机装配。",
    result: "完成实验样机；测试中颗粒物去除率超过 99%，有害气体去除率超过 90%。",
    metric: "> 99%",
    metricLabel: "实验样机颗粒物去除率",
    visual: "air",
  },
};

export const SKILL_GROUPS = [
  {
    name: "嵌入式开发",
    items: ["C / C++", "STM32 · ESP32", "FreeRTOS · ESP-IDF", "CANopen · Modbus"],
  },
  {
    name: "运动与系统控制",
    items: ["FOC · PID / PI", "ROS2 · Nav2", "MuJoCo · PPO", "自动化测试"],
  },
  {
    name: "硬件与科学仿真",
    items: ["KiCad · PCB", "KLayout · DRC", "openEMS · FDTD", "LAMMPS"],
  },
  {
    name: "计算与工具",
    items: ["Python", "MATLAB", "Linux · Git", "数据分析 · 数学建模"],
  },
];
