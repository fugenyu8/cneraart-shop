import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

/**
 * 命理测算系统功能测试
 * 测试规则数据、数据库操作和API功能
 */
describe("Fortune Telling System", () => {
  describe("Rules Database", () => {
    it("应该有面相规则数据", async () => {
      const rules = await db.getFaceRules();
      expect(rules.length).toBeGreaterThan(0);
      expect(rules[0]).toHaveProperty("palaceName");
      expect(rules[0]).toHaveProperty("featureName");
      expect(rules[0]).toHaveProperty("interpretation");
    });

    it("应该有手相规则数据", async () => {
      const rules = await db.getPalmRules();
      expect(rules.length).toBeGreaterThan(0);
      expect(rules[0]).toHaveProperty("lineName");
      expect(rules[0]).toHaveProperty("featureName");
      expect(rules[0]).toHaveProperty("interpretation");
    });

    it("应该有风水规则数据", async () => {
      const rules = await db.getFengshuiRules();
      expect(rules.length).toBeGreaterThan(0);
      expect(rules[0]).toHaveProperty("roomType");
      expect(rules[0]).toHaveProperty("ruleName");
      expect(rules[0]).toHaveProperty("interpretation");
    });

    it("应该能按类别筛选面相规则", async () => {
      const rules = await db.getFaceRules(undefined, "事业");
      expect(rules.length).toBeGreaterThan(0);
      expect(rules.every((r) => r.category === "事业")).toBe(true);
    });

    it("应该能按房间类型筛选风水规则", async () => {
      const rules = await db.getFengshuiRules("bedroom");
      expect(rules.length).toBeGreaterThan(0);
      expect(rules.every((r) => r.roomType === "bedroom")).toBe(true);
    });
  });

  describe("Database Operations", () => {
    let testTaskId: string;

    it("应该能创建命理测算任务", async () => {
      testTaskId = `TEST-${Date.now()}`;
      
      await db.createFortuneTask({
        taskId: testTaskId,
        orderId: 1,
        userId: 1,
        serviceType: "face",
      });

      const task = await db.getFortuneTask(testTaskId);
      expect(task).toBeDefined();
      expect(task?.serviceType).toBe("face");
      expect(task?.status).toBe("created");
    });

    it("应该能更新任务状态", async () => {
      await db.updateFortuneTaskStatus(testTaskId, {
        status: "processing",
        progress: 50,
      });

      const task = await db.getFortuneTask(testTaskId);
      expect(task?.status).toBe("processing");
      expect(task?.progress).toBe(50);
    });

    it("应该能创建测算报告", async () => {
      await db.createFortuneReport({
        taskId: testTaskId,
        userId: 1,
        serviceType: "face",
        overallSummary: "测试报告",
        sectionsJson: { test: "data" },
        score: 85,
      });

      const report = await db.getFortuneReport(testTaskId);
      expect(report).toBeDefined();
      expect(report?.overallSummary).toBe("测试报告");
      expect(report?.score).toBe(85);
    });
  });

  describe("Calculation Engines", () => {
    it("面相计算引擎应该正常工作", async () => {
      const { calculateFacePhysiognomy } = await import("./physiognomy-engine");
      
      const mockFeatures = {
        命宫: { 额头高度: 75, 额头光洁度: 85 },
        兄弟宫: { 眉毛浓度: 65 },
      };

      const result = await calculateFacePhysiognomy(mockFeatures as any);
      expect(result).toHaveProperty("overallScore");
      expect(result).toHaveProperty("items");
    });

    it("手相计算引擎应该正常工作", async () => {
      const { calculatePalmPhysiognomy } = await import("./physiognomy-engine");
      
      const mockFeatures = {
        lines: {
          生命线: { 长度: 85, 深度: 75 },
          智慧线: { 长度: 80, 清晰度: 85 },
        },
        hills: {},
      };

      const result = await calculatePalmPhysiognomy(mockFeatures as any);
      expect(result).toHaveProperty("overallScore");
      expect(result).toHaveProperty("items");
    });

    it("风水计算引擎应该正常工作", async () => {
      const { calculateRoomFengshui } = await import("./fengshui-engine");
      
      const mockFeatures = {
        roomType: "bedroom",
        床头靠墙: "是",
        主色调: "米色",
      };

      const result = await calculateRoomFengshui(mockFeatures as any);
      expect(result).toHaveProperty("overallScore");
      expect(result).toHaveProperty("items");
    });
  });
});
