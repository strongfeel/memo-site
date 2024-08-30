import Todo from "../schemas/todo.schema.js";
import express from "express";

const router = express.Router();

router.post("/todos", async (req, res) => {
  // 클라이언트에게 전달받은 value 데이터를 변수에 저장합니다.
  const { value } = req.body;

  if (!value) {
    return res
      .status(400)
      .json({ errorMessage: "해야할 일(value) 데이터가 존재하지 않습니다." });
  }

  // Todo모델을 사용해, MongoDB에서 'order' 값이 가장 높은 '해야할 일'을 찾습니다.
  const todoMaxOrder = await Todo.findOne().sort("-order").exec();

  // 'order' 값이 가장 높은 도큐멘트의 1을 추가하거나 없다면, 1을 할당합니다.
  const order = todoMaxOrder ? todoMaxOrder.order + 1 : 1;

  // Todo모델을 이용해, 새로운 '해야할 일'을 생성합니다.
  const todo = new Todo({ value, order });

  // 생성한 '해야할 일'을 MongoDB에 저장합니다.
  await todo.save();

  return res.status(201).json({ todo });
});

router.get("/todos", async (req, res) => {
  // Todo모델을 이용해, MongoDB에서 'order' 값이 가장 높은 '해야할 일'을 찾습니다.
  const todos = await Todo.find().sort("-order").exec();

  // 찾은 '해야할 일'을 클라이언트에게 전달합니다.
  return res.status(200).json({ todos });
});

export default router;
