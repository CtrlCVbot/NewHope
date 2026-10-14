# 새소망 2차 전용 폰트

`PYTHONPATH=<fonttools runtime> python scripts/build-v3-saesomang-fonts.py`로 재생성합니다. FontTools 4.60.1과 Brotli 1.2.0이 필요합니다. 출력 폰트는 새 family 이름으로 바꾸되 원본 폰트와 1차 subset은 수정하지 않습니다. subset 밖의 동적 입력은 기존 로컬 fallback으로 표시됩니다.
