## Machine Learning & Mathematics

- [Intuition for entropy & KL divergence](https://jaketae.github.io/study/information-entropy/)
  - "Shannon information" represents the amount of information gained from an event. If an event is very common, you really don't gain very much information from learning that it happened. If an event is very rare, it is more informative. If the sun rises every day, it's not super useful to learn that it will happen again tomorrow.
  - "Entropy" is the average amount of information needed to represent an event sampled from a probability distribution `X`. Entropy is the highest when a probability distribution is completely uniform. This makes sense for two reasons: (1) for an unbalanced distribution, the weighted average information is dominated by the common event, which has low information; (2) when a distribution is completely uniform, it's harder to predict!
  - "KL Divergence" is "the average number of extra bits needed to encode the data, due to the fact that we used distribution `q` to encode the data instead of the true distribution `p`". KL Divergence is zero when the distributions are the same, i.e. we needed no extra bits.
  - "Cross Entropy" is just `kl_divergence + q_entropy`. I.e. the cross entropy is the average amount of information needed when we use `q` instead of `p`. Minimizing this is minimizing both the entropy (i.e. uncertainty) of `q`, while also minimizing the distance between `q` and `p`.

## AI

Introductory:

- [A visual proof that neural nets can compute any function](http://neuralnetworksanddeeplearning.com/chap4.html)
  - This interactive website provides a satisfying justification for the "power" of neural networks to accomplish almost anything.

Transformers:

- [Attention is All You Need](https://arxiv.org/abs/1706.03762)
  - The original paper introducing Transformer models, the model used for most LLMs.
- [An Introduction to Transformers](https://arxiv.org/abs/2304.10557)
- [Formal Algorithms for Transfomers](https://arxiv.org/abs/2207.09238)

LLMs:

- [Let's build GPT: from scratch, in code, spelled out.](https://www.youtube.com/watch?v=kCc8FmEb1nY)
  - A truly awesome tutorial that helps build an intuition for how these models are actually "built".
- [Language Models are Unsupervised Multitask Learners (GPT-2)](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
- [Language Models are Few-Shot Learners (GPT-3)](https://arxiv.org/abs/2005.14165)
- [Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361)

Fine-Tuning:

- [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)
- [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155)

Mixture of Experts (MoE):

- [Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer](https://openreview.net/pdf?id=B1ckMDqlg)
  - This paper explores the use of Mixture of Experts (MoE) for NLP. MoE is rumored to be used in GPT-4.
  - Mixture of Experts = only running select parts of a neural network during inference time. Each "part" of the network is called an expert. The routing is determined by learned parameters, as simple as a single weight matrix.
  - MoE is nice because it allows for scaling model parameter count without needing to proportionally scale inference compute.
  - They explored the challenge of splitting inference across experts reducing the number of examples each expert sees within a batch.
    - Naively, one would train multiple copies of the full model in parallel. This would require `N` times more training data per batch for `N` experts in order to get the same batch size for the expert.
    - Instead, they only host a _single_ shared instance of an expert, such that increasing the number of distributed devices increases the number of samples seen by the expert.
  - Something I didn't fully understand in this paper and would like to revisit is how they made the routing differentiable using random noise. It seems that by adding noise, they made routing involve continuous probabilities that enabled differentiation?
- [Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity](https://arxiv.org/abs/2101.03961)
  - This paper explores the idea that it is unnecessary to route to more than one expert at a time.
  - In this case, the MoE layers are in the feedforward section of the transformer layers. The experts operate indepdently on each token in the sequence, as is done with the standard feedforward section of the transformer layer.
  - This paper also discusses a lot of the infrastructure challenges with this type of model. I have less experience in the domain of distributed training so didn't get as much from this section. One interesting idea was the idea of "expert capacity", where experts would process batches of multiple tokens at once, which is necessary to maximize the compute capacity of GPUs/TPUs. Because the number of tokens allocated to an expert within a single batch is dynamic based on the routing gate & matrix multiplications needed to be statically initialized, the researchers essentially needed to "predict" the maximum batch size for each expert.
- [Mixture-of-Depths: Dynamically allocating compute in transformer-based language models](https://arxiv.org/abs/2404.02258)

Augmented LLMs:

- [Augmented Language Models: a Survey](https://arxiv.org/abs/2302.07842)
- [Retrieval-Augmented Generation for Large Language Models: A Survey](https://arxiv.org/abs/2312.10997)
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
  - ReAct (reason + action) is an LLM prompting strategy that interleaves thoughts (reasoning) with actions (searching, performing some observation, answering the question) in order to accomplish some task.
  - ReAct is a combination of two existing approaches: chain-of-thought prompting for improving LLM reasoning + actions.

OpenAI o1 & Test-Time Compute:

- [Let's Verify Step by Step](https://arxiv.org/abs/2305.20050)
  - This paper explores the idea of training a verifier model to verify solutions or logical steps, and then using that verifier to score the correctness of many LLM-generated problem solutions.
  - The verifier models comes in two types: one that predicts the probability that each _step_ is correct, and one that predicts the probability that the entire solution as a whole is correct.
  - The first type of verifier model requires training from human-labelled data.
  - This paper represents an interesting paradigm shift: test-time compute (the amount of compute used for inference) can matter just as much as train-time compute.
  - This paper acknowledges the potential of training a solution-generating model on the reward outputs from the verifier model.
- [Qwen2.5-Math Technical Report](https://arxiv.org/html/2409.12122v1)

Model Deployment:

- [Distributed Training of Deep Learning Models:
  A Taxonomic Perspective](https://arxiv.org/abs/2007.03970)
  - This paper describes the landscape of distributed model training (as of 2020).
  - Distributed model training is broken down into two main categories: **data parallelism** and **model parallelism**.
  - Data parallelism splits the training data across multiple replicas of the same model.
    - As long as individual data points can be processed by the model independently (i.e. you aren't using something like batch normalization), then you can simply split a mini-batch of data across multiple models and then aggregate the results at the end.
  - Model parallelism splits the model across multiple processes / machines.
    - This is useful if the model is too large to fit on a single machine / GPU.
    - Model parallelism can be either **horizontal** or **vertical**.
    - Regardless of the type of model parallelism, this requires passing messages about model state between machines, where this communication can become a bottleneck.
    - Vertical model parallelism means splitting the model layer-by-layer.
      - Naively, all but one of the machines will be active at once unless a pipelining technique is used.
    - Horizontal model parallelism means splitting the model within layers.
      - This is much more complex and often avoided if possible.
      - In a simple example, consider splitting a single large matrix multiplication across multiple machines. At the end of the day, a matrix multiplication is most simply a series of dot products.
- [Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180)
- [Transformer Inference Arithmetic](https://kipp.ly/transformer-inference-arithmetic/)
- [LLM Inference Performance Engineering](https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices)

Quantization:

- [Survey of Quantization Methods](https://noway.moe/llama/quantization)
- [GPTQ Paper](https://arxiv.org/abs/2210.17323)
- [AWQ Paper](https://arxiv.org/pdf/2306.00978)
- [GGUF](https://github.com/ggerganov/ggml/blob/master/docs/gguf.md)

Embedding Models:

- [Text and Code Embeddings by Contrastive Pre-Training](https://arxiv.org/abs/2201.10005)
  - This paper introduces an embedding model trained with large-scale contrastive pre-training.
  - Contrastive pre-training is where the model is tasked to produce a single vector for a segment of text. If two segments of text are assumed to be similar, then cross-entropy loss incentivizes the model to increase the cosine similarity between those two vectors. The opposite is true for negative pairs.
  - This learning is unsupervised, leveraging the assumption that nearby text is similar.
  - They use a clever training trick where they compute the embedding vector for every segment in a batch once, and then they use all the embeddings not related to the original positive text pair to represent the negative pairs.

Evaluation:

- [RAGAS: Automated Evaluation of Retrieval Augmented Generation](https://arxiv.org/abs/2309.15217)

Diffusion:

- [Scalable Diffusion Models with Transformers](https://arxiv.org/abs/2212.09748)

State Space Models:

- [Mamba: Linear-Time Sequence Modeling with Selective State Spaces](https://arxiv.org/abs/2312.00752)

## Distributed Systems

- [Spanner: Google’s Globally-Distributed Database](https://static.googleusercontent.com/media/research.google.com/en//archive/spanner-osdi2012.pdf)
- [MapReduce: Simplified Data Processing on Large Clusters](https://static.googleusercontent.com/media/research.google.com/en//archive/mapreduce-osdi04.pdf)
- [ZooKeeper: Wait-free coordination for Internet-scale systems](https://www.usenix.org/legacy/event/atc10/tech/full_papers/Hunt.pdf)
