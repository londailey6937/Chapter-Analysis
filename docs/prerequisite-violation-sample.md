# Concept Sequencing Stress Test

> Copy this content into a DOCX or paste directly into the editor to trigger prerequisite-order warnings.

## How to Use

1. Copy the full chapter below into a blank DOCX (or paste straight into the Writer Mode editor).
2. Upload/run the analysis; select any STEM domain so concept extraction kicks in.
3. Open the Concept Overview card and review the new Prerequisite Order Check for conflicts around backpropagation, gradient descent, and perceptrons.
4. Confirm that batch normalization shows up as a missing prerequisite since it is referenced but never defined.

## Section 1: Neural Backpropagation First

Neural backpropagation efficiently adjusts weights across layers before we spend any time explaining what an artificial neuron is. The chapter expects familiarity with gradient descent even though we have not introduced gradients, derivatives, or even loss functions yet. Readers meet L2 regularization penalties and dropout scheduling before they hear that the network contains perceptrons connected in layers.

## Section 2: Introducing Gradient Descent Later

Gradient descent finally appears here, long after backpropagation was described as a core workflow. We now mention differentiable loss functions and the idea of a learning rate. This late introduction forces the reader to retroactively map the algorithm, which is exactly the sequencing violation the new card should flag.

## Section 3: Perceptrons and Activation Basics

Only now do we explain that a perceptron sums weighted inputs, applies a bias, and pushes the value through an activation function such as ReLU or sigmoid. The absence of this definition earlier makes the prior sections unreadable for novices.

## Section 4: Missing Concept Entirely

Batch normalization is referenced as a tuning stage that stabilizes activations, but we never define normalization layers anywhere else in the chapter. This deliberate omission should surface as a missing prerequisite in the analyzer output.

## Section 5: Wrap-Up

We close by celebrating rapid training times and deployment patterns. The goal is to provide plenty of narrative content so the tool has enough text to build concept mentions while still leaving the prerequisite trail broken on purpose.
