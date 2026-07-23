export interface SubnettingQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

function maskFromCidr(cidr: number) {
  const mask = (0xffffffff << (32 - cidr)) >>> 0;
  return [24, 16, 8, 0].map((shift) => (mask >>> shift) & 255).join(".");
}

function wildcardFromMask(mask: string) {
  return mask.split(".").map((octet) => 255 - Number(octet)).join(".");
}

function hosts(cidr: number) {
  return cidr === 32 ? 1 : Math.max(0, 2 ** (32 - cidr) - 2);
}

function shuffleOptions(correct: string, distractors: string[], seed: number) {
  const options = [correct, ...distractors.filter((item) => item !== correct)].slice(0, 4);
  return options.sort((a, b) => ((a.length * seed + a.charCodeAt(0)) % 17) - ((b.length * seed + b.charCodeAt(0)) % 17));
}

export const subnettingQuestions: SubnettingQuestion[] = Array.from({ length: 100 }, (_, index) => {
  const id = index + 1;
  const cidr = 16 + (index % 15);
  const mask = maskFromCidr(cidr);
  const usable = hosts(cidr);
  const wildcard = wildcardFromMask(mask);
  const block = 2 ** (32 - cidr);
  const type = index % 4;

  if (type === 0) {
    return {
      id,
      question: `Q${id}. What is the subnet mask for /${cidr}?`,
      answer: mask,
      options: shuffleOptions(mask, [maskFromCidr(Math.max(1, cidr - 1)), maskFromCidr(Math.min(32, cidr + 1)), "255.255.255.0"], id),
      explanation: `/${cidr} means ${cidr} network bits. The dotted-decimal subnet mask is ${mask}.`
    };
  }

  if (type === 1) {
    return {
      id,
      question: `Q${id}. How many usable host addresses are available in a /${cidr} subnet?`,
      answer: String(usable),
      options: shuffleOptions(String(usable), [String(Math.max(0, usable - 2)), String(usable + 2), String(2 ** (32 - cidr))], id),
      explanation: `Usable hosts are 2^host bits - 2. For /${cidr}, host bits = ${32 - cidr}, so usable hosts = ${usable}.`
    };
  }

  if (type === 2) {
    return {
      id,
      question: `Q${id}. What wildcard mask matches ${mask}?`,
      answer: wildcard,
      options: shuffleOptions(wildcard, [wildcardFromMask(maskFromCidr(Math.max(1, cidr - 1))), wildcardFromMask(maskFromCidr(Math.min(32, cidr + 1))), "0.0.0.255"], id),
      explanation: `Wildcard mask is the inverse of the subnet mask. ${mask} becomes ${wildcard}.`
    };
  }

  return {
    id,
    question: `Q${id}. What is the address block size for a /${cidr} network?`,
    answer: String(block),
    options: shuffleOptions(String(block), [String(block / 2), String(block * 2), String(Math.max(1, block - 2))], id),
    explanation: `Block size is 2^(32 - prefix). For /${cidr}, the block size is ${block}.`
  };
});
