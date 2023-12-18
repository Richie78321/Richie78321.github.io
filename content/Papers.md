## AI

Introductory:

- [A visual proof that neural nets can compute any function](http://neuralnetworksanddeeplearning.com/chap4.html)
  - This interactive website provides a satisfying justification for the "power" of neural networks to accomplish almost anything.

LLMs:

- [Attention is All You Need](https://arxiv.org/abs/1706.03762)
  - The original paper introducing Transformer models, the model used for most LLMs.
- [An Introduction to Transformers](https://arxiv.org/abs/2304.10557)
- [Let's build GPT: from scratch, in code, spelled out.](https://www.youtube.com/watch?v=kCc8FmEb1nY)
  - A truly awesome tutorial that helps build an intuition for how these models are actually "built".

GPTs:

- [Language Models are Unsupervised Multitask Learners (GPT-2)](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
- [Language Models are Few-Shot Learners (GPT-3)](https://arxiv.org/abs/2005.14165)

Mixture of Experts (MoE):

- [Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer](https://openreview.net/pdf?id=B1ckMDqlg)
  - This paper explores the use of Mixture of Experts (MoE) for NLP. MoE is rumored to be used in GPT-4.
  - Mixture of Experts = only running select parts of a neural network during inference time. Each "part" of the network is called an expert. The routing is determined by learned parameters, as simple as a single weight matrix.
  - MoE is nice because it allows for scaling model parameter count without needing to proportionally scale inference compute.
  - Something I didn't fully understand in this paper and would like to revisit is how they made the routing differentiable using random noise. It seems that by adding noise, they made routing involve continuous probabilities they enabled differentiation?
- [Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity](https://arxiv.org/abs/2101.03961)
  - This paper explores the idea that it is unnecessary to route to more than one expert at a time.
  - In this case, the MoE layers are in the feedforward section of the transformer layers. The experts operate indepdently on each token in the sequence, as is done with the standard feedforward section of the transformer layer.
  - This paper also discusses a lot of the infrastructure challenges with this type of model. I have less experience in the domain of distributed training so didn't get as much from this section. One interesting idea was the idea of "expert capacity", where experts would process batches of multiple tokens at once, which is necessary to maximize the compute capacity of GPUs/TPUs. Because the number of tokens allocated to an expert within a single batch is dynamic based on the routing gate & matrix multiplications needed to be statically initialized, the researchers essentially needed to "predict" the maximum batch size for each expert.

Test-Time Compute:

- [Let's Verify Step by Step](https://arxiv.org/abs/2305.20050)
  - This paper explores the idea of training a verifier model to verify solutions or logical steps, and then using that verifier to score the correctness of many LLM-generated problem solutions.
  - The verifier models comes in two types: one that predicts the probability that each _step_ is correct, and one that predicts the probability that the entire solution as a whole is correct.
  - The first type of verifier model requires training from human-labelled data.
  - This paper represents an interesting paradigm shift: test-time compute (the amount of compute used for inference) can matter just as much as train-time compute.
  - This paper acknowledges the potential of training a solution-generating model on the reward outputs from the verifier model.

## Distributed Systems

- [Spanner: Google’s Globally-Distributed Database](https://static.googleusercontent.com/media/research.google.com/en//archive/spanner-osdi2012.pdf)
- [MapReduce: Simplified Data Processing on Large Clusters](https://static.googleusercontent.com/media/research.google.com/en//archive/mapreduce-osdi04.pdf)
- [ZooKeeper: Wait-free coordination for Internet-scale systems](https://www.usenix.org/legacy/event/atc10/tech/full_papers/Hunt.pdf)
