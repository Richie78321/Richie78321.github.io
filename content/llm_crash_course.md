# LLM Crash Course

In January 2024, I became a founding engineer on the generative AI team at Applied Intuition. I had to spin up on LLMs quickly with no formal ML experience. Below is an opinionated guide to learning about LLMs. Each resource has a priority, P1 meaning most important.

## Transformers

Resources:

- P1: [Attention Is All You Need (paper that introduced transformers)](https://arxiv.org/abs/1706.03762)
- P1: [An Introduction to Transformers](https://arxiv.org/abs/2304.10557)
- P2: [Inductive Bias Wikipedia](https://en.wikipedia.org/wiki/Inductive_bias)
- P1: [Chinchilla Scaling Laws](https://arxiv.org/pdf/2203.15556)

Questions you want to answer:

- What are the core components of a transformer block? What is self-attention? What is cross-attention? What is multi-headed attention?
- In the NLP domain, what did transformers replace?
- What is inductive bias and why do transformers have less of it than earlier NLP methods?
- What does less inductive bias typically mean for training data requirements & scalability?
- What are large language model scaling laws? Why are they significant? How are they useful for model experimentation?

## Transformer Applications

Resources:

- Large language models (LLMs)
  - P1: [State of GPT](https://www.youtube.com/watch?v=bZQun8Y4L2A)
  - P3: [A survey of language modeling](https://lilianweng.github.io/posts/2019-01-31-lm/)
  - Decoder-only
    - P1: [Let's build GPT: from scratch, in code, spelled out](https://www.youtube.com/watch?v=kCc8FmEb1nY)
    - P2: [GPT-1 Paper](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)
    - P2: [GPT-2 Paper](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
    - P2: [GPT-3 Paper](https://arxiv.org/abs/2005.14165)
    - P2: [InstructGPT Paper](https://arxiv.org/pdf/2203.02155)
  - Encoder-only
    - P2: [BERT Paper](https://arxiv.org/abs/1810.04805)
  - Encoder-decoder
    - P3: [Google T5 Paper](https://arxiv.org/abs/1910.10683)
  - [Mixture of experts](https://arxiv.org/pdf/2101.03961)
- P2: [Vision transformers](https://arxiv.org/pdf/2010.11929)
- P3: [Object detection (DETR)](https://arxiv.org/abs/2005.12872)

Questions you want to answer:

- What are the three popular transformer architectures? When are they used?
- What is the benefit of mixture-of-experts models?
- Encoder-only and decoder-only architectures only have a few key differences -- what are they?
- What is the motivation for masked attention in decoder-only transformers?
- Are transformers only designed to work on sequential data?
- [probably more]

## LLM Productionization

Resources:

- P1: [Transformer Inference Arithmetic](https://kipp.ly/transformer-inference-arithmetic/)
- P2: [GPTQ Paper (early quantization technique)](https://arxiv.org/abs/2210.17323)
- P2: [LoRA (low-cost LLM fine-tuning)](https://arxiv.org/abs/2106.09685)
- P2: [PagedAttention](https://arxiv.org/pdf/2309.06180)
- P3: [FlashAttention (CUDA kernel-level optimizations)](https://arxiv.org/pdf/2205.14135)
- P3: [Data & Model Parallelism Survey](https://arxiv.org/pdf/2007.03970)

Questions you want to answer:

- What are the typical performance bottlenecks for LLM inference?
  - Why is batch size so important?
  - What do you do when your LLM inference is compute constrained?
  - What do you do when your LLM inference is memory-bandwidth constrained?
  - What do you do when you do not have enough VRAM to serve your LLM?
- What is the purpose of a kv-cache? What happens if you don't have one?
  - How does masked attention enable kv-caching?
- How do you serve LLMs that cannot fit (VRAM) on a single device (GPU)?
- Why is LoRA desirable when fine-tuning?
  - Does an LLM with a LoRA require more inference-time compute?
  - What does it mean to merge a LoRA?
  - Can you serve an LLM with multiple LoRAs simulatenously?
