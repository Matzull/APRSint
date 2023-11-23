import os
import services.aprs_client as aprs


def main():
    os.system("cls")
    aprsc = aprs.AprsClient()
    aprsc.connect()
    aprsc.receive(debug=False, parse=False)


if __name__ == "__main__":
    main()
